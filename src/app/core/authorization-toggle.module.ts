import { ModuleWithProviders, NgModule } from '@angular/core';

import { AuthorizationToggleDirective } from './directives/authorization-toggle.directive';
import { NotAuthorizationToggleDirective } from './directives/not-authorization-toggle.directive';
import { AuthorizationToggleService } from './utils/authorization-toggle/authorization-toggle.service';

@NgModule({
  declarations: [AuthorizationToggleDirective, NotAuthorizationToggleDirective],
  exports: [AuthorizationToggleDirective, NotAuthorizationToggleDirective],
})
export class AuthorizationToggleModule {
  private static permissions: string[];

  static forTesting(...permissions: string[]): ModuleWithProviders {
    AuthorizationToggleModule.switchTestingPermissions(...permissions);
    return {
      ngModule: AuthorizationToggleModule,
      providers: [
        {
          provide: AuthorizationToggleService,
          useValue: {
            isAuthorizedTo: (permission: string) => AuthorizationToggleModule.permissions.includes(permission),
          },
        },
      ],
    };
  }

  static switchTestingPermissions(...permissions: string[]) {
    AuthorizationToggleModule.permissions = permissions;
  }
}

export { AuthorizationToggleService } from './utils/authorization-toggle/authorization-toggle.service';
export { AuthorizationToggleGuard } from './guards/authorization-toggle.guard';
