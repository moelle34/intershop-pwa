import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Locale } from 'ish-core/models/locale/locale.model';
import { User } from 'ish-core/models/user/user.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';

@Component({
  selector: 'ish-user-edit-profile-page',
  templateUrl: './user-edit-profile-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserEditProfilePageComponent implements OnInit, OnDestroy {
  currentLocale$: Observable<Locale>;
  loading$: Observable<boolean>;
  userError$: Observable<HttpError>;
  selectedUser$: Observable<User>;
  private destroy$ = new Subject();

  error: HttpError;
  profile: FormGroup;
  titles: string[];
  currentCountryCode = '';
  user: User;
  submitted = false;

  constructor(private fb: FormBuilder, private organizationManagementFacade: OrganizationManagementFacade) {}

  ngOnInit() {
    this.loading$ = this.organizationManagementFacade.usersLoading$;
    this.userError$ = this.organizationManagementFacade.usersError$;
    this.selectedUser$ = this.organizationManagementFacade.selectedUser$;

    this.selectedUser$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(user => {
      this.user = user;
      this.editUserProfileForm(user);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  editUserProfileForm(userProfile: User) {
    this.profile = this.fb.group({
      title: [userProfile.title ? userProfile.title : ''],
      firstName: [userProfile.firstName, [Validators.required]],
      lastName: [userProfile.lastName, [Validators.required]],
      phone: [userProfile.phoneHome],
      birthday: [userProfile.birthday],
      preferredLanguage: [userProfile.preferredLanguage],
    });
  }

  submitForm() {
    if (this.profile.invalid) {
      markAsDirtyRecursive(this.profile);
      return;
    }

    const formValue = this.profile.value;

    const user: User = {
      title: formValue.title,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: this.user.email,
      phoneHome: formValue.phone,
      birthday: formValue.birthday === '' ? undefined : formValue.birthday, // TODO: see IS-22276
      preferredLanguage: formValue.preferredLanguage,
      businessPartnerNo: this.user.businessPartnerNo,
    };
    this.organizationManagementFacade.updateUser(user);
  }

  get formDisabled() {
    return this.profile.invalid && this.submitted;
  }
}
