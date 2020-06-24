import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';

import { AuthorizationToggleService } from 'ish-core/utils/authorization-toggle/authorization-toggle.service';
import { HttpStatusCodeService } from 'ish-core/utils/http-status-code/http-status-code.service';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationToggleGuard implements CanActivate {
  constructor(
    private authorizationToggleService: AuthorizationToggleService,
    private router: Router,
    private httpStatusCodeService: HttpStatusCodeService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    if (!this.authorizationToggleService.isAuthorizedTo(route.data.permission)) {
      this.httpStatusCodeService.setStatus(404);
      return this.router.parseUrl('/error');
    }
    return true;
  }
}
