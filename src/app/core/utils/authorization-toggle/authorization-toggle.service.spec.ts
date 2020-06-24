import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';

import { Customer } from 'ish-core/models/customer/customer.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { loadRolesAndPermissionsSuccess } from 'ish-core/store/customer/authorization';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';
import { loginUserSuccess } from 'ish-core/store/customer/user';

import { AuthorizationToggleService } from './authorization-toggle.service';

describe('Authorization Toggle Service', () => {
  let store$: Store;
  let authorizationToggleService: AuthorizationToggleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), CustomerStoreModule.forTesting('authorization', 'user')],
    });

    store$ = TestBed.inject(Store);
    store$.dispatch(
      loadRolesAndPermissionsSuccess({ authorization: { roleDisplayNames: [], permissionIDs: ['DO_THIS'] } })
    );

    authorizationToggleService = TestBed.inject(AuthorizationToggleService);
  });

  describe('isAuthorizedTo', () => {
    describe('for B2B users', () => {
      beforeEach(() => {
        store$.dispatch(loginUserSuccess({ customer: { isBusinessCustomer: true } as Customer }));
      });

      it('should return true if user has permission', () => {
        expect(authorizationToggleService.isAuthorizedTo('DO_THIS')).toBeTrue();
      });

      it("should return false if user doesn't have permission", () => {
        expect(authorizationToggleService.isAuthorizedTo('DO_THAT')).toBeFalse();
      });
    });

    describe('for B2C or anonymous users', () => {
      it('should always return true', () => {
        expect(authorizationToggleService.isAuthorizedTo('DO_THIS')).toBeTrue();
        expect(authorizationToggleService.isAuthorizedTo('DO_THAT')).toBeTrue();
      });
    });
  });
});
