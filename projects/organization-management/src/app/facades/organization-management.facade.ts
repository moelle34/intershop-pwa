import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { User } from 'ish-core/models/user/user.model';

import { deleteUser, getSelectedUser, getUsers, getUsersError, getUsersLoading, loadUsers } from '../store/users';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class OrganizationManagementFacade {
  constructor(private store: Store) {}

  users$() {
    this.store.dispatch(loadUsers());
    return this.store.pipe(select(getUsers));
  }
  usersError$ = this.store.pipe(select(getUsersError));
  usersLoading$ = this.store.pipe(select(getUsersLoading));
  selectedUser$ = this.store.pipe(select(getSelectedUser));

  deleteUser(user: User) {
    this.store.dispatch(deleteUser({ user }));
  }
}
