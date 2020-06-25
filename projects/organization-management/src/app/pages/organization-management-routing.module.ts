import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserCreatePageComponent } from './user-create/user-create-page.component';
import { UserDetailPageComponent } from './user-detail/user-detail-page.component';
import { UserEditProfilePageComponent } from './user-edit-profile/user-edit-profile-page.component';
import { UsersPageComponent } from './users/users-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  {
    path: 'users',
    component: UsersPageComponent,
    data: { breadcrumbData: [{ key: 'account.organization.user_management' }] },
  },
  { path: 'users/create', component: UserCreatePageComponent },
  {
    path: 'users/:B2BCustomerLogin',
    component: UserDetailPageComponent,
    data: { breadcrumbData: [{ key: 'account.organization.user_management.user_detail' }] },
  },
  { path: 'users/:B2BCustomerLogin/profile', component: UserEditProfilePageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizationManagementRoutingModule {}
