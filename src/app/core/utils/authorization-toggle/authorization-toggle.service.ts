import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { getUserPermissions } from 'ish-core/store/customer/authorization';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';

@Injectable({ providedIn: 'root' })
export class AuthorizationToggleService {
  private permissions: string[];
  private isB2B: boolean;

  constructor(store: Store) {
    store.pipe(select(getUserPermissions)).subscribe(permissions => (this.permissions = permissions));
    store.pipe(select(getLoggedInCustomer)).subscribe(customer => (this.isB2B = customer?.isBusinessCustomer));
  }

  isAuthorizedTo(permissionId: string): boolean {
    return !this.isB2B || this.permissions.includes(permissionId);
  }
}
