import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { concatMap, debounceTime, exhaustMap, map, mapTo, mergeMap, tap, withLatestFrom } from 'rxjs/operators';

import { Customer } from 'ish-core/models/customer/customer.model';
import { displaySuccessMessage } from 'ish-core/store/core/messages';
import { selectRouteParam } from 'ish-core/store/core/router';
import { setBreadcrumbData } from 'ish-core/store/core/viewconf';
import { getLoggedInCustomer, logoutUser } from 'ish-core/store/customer/user';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import { UsersService } from '../../services/users/users.service';

import {
  addUser,
  addUserFail,
  addUserSuccess,
  deleteUser,
  deleteUserFail,
  deleteUserSuccess,
  loadUserFail,
  loadUserSuccess,
  loadUsers,
  loadUsersFail,
  loadUsersSuccess,
  resetUsers,
  updateUser,
  updateUserFail,
  updateUserSuccess,
} from './users.actions';
import { getSelectedUser } from './users.selectors';

@Injectable()
export class UsersEffects {
  constructor(
    private actions$: Actions,
    private usersService: UsersService,
    private store: Store,
    private translateService: TranslateService,
    private router: Router
  ) {}

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUsers),
      exhaustMap(() =>
        this.usersService.getUsers().pipe(
          map(users => loadUsersSuccess({ users })),
          mapErrorToAction(loadUsersFail)
        )
      )
    )
  );

  loadDetailedUser$ = createEffect(() =>
    this.store.pipe(
      select(selectRouteParam('B2BCustomerLogin')),
      whenTruthy(),
      debounceTime(0), // necessary to wait for the login after refreshing the page
      exhaustMap(login =>
        this.usersService.getUser(login).pipe(
          map(user => loadUserSuccess({ user })),
          mapErrorToAction(loadUserFail)
        )
      )
    )
  );

  addUser$ = this.actions$.pipe(
    ofType(addUser),
    mapToPayload(),
    withLatestFrom(this.store.pipe<Customer>(select(getLoggedInCustomer))),
    concatMap(([payload, customer]) =>
      this.usersService.addUser({ user: payload.user, customer }).pipe(
        tap(() => {
          // TODO: use relative link
          this.router.navigateByUrl('account/organization/users');
        }),
        mergeMap(user => [
          addUserSuccess({ user: user[0] }),
          displaySuccessMessage({
            message: 'account.user.new.heading',
          }),
        ]),
        mapErrorToAction(addUserFail)
      )
    )
  );

  updateUser$ = this.actions$.pipe(
    ofType(updateUser),
    mapToPayload(),
    withLatestFrom(this.store.pipe<Customer>(select(getLoggedInCustomer))),
    concatMap(([payload, customer]) =>
      this.usersService.updateUser(payload.user.email, { user: payload.user, customer }).pipe(
        tap(user => {
          // TODO: use relative link with login name instead of businessPartnerNo
          this.router.navigateByUrl(`account/organization/users/${user.businessPartnerNo}`);
        }),
        mergeMap(user => [
          updateUserSuccess({ user }),
          displaySuccessMessage({
            message: 'account.profile.update_profile.message',
          }),
        ]),
        mapErrorToAction(updateUserFail)
      )
    )
  );

  deleteUser$ = this.actions$.pipe(
    ofType(deleteUser),
    mapToPayloadProperty('user'),
    exhaustMap(user =>
      this.usersService
        .deleteUser(user.email)
        .pipe(map(() => deleteUserSuccess({ user }), mapErrorToAction(deleteUserFail)))
    )
  );

  setUserDetailBreadcrumb$ = createEffect(() =>
    this.store.pipe(
      select(getSelectedUser),
      whenTruthy(),
      withLatestFrom(this.translateService.get('account.organization.user_management.user_detail.breadcrumb')),
      map(([user, prefixBreadcrumb]) =>
        setBreadcrumbData({
          breadcrumbData: [
            { key: 'account.organization.user_management', link: '/account/organization/users' },
            { text: `${prefixBreadcrumb} - ${user.firstName} ${user.lastName}` },
          ],
        })
      )
    )
  );

  resetUsersAfterLogout$ = createEffect(() => this.actions$.pipe(ofType(logoutUser), mapTo(resetUsers())));
}
