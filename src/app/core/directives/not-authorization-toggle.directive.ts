import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

import { AuthorizationToggleService } from 'ish-core/utils/authorization-toggle/authorization-toggle.service';

@Directive({
  selector: '[ishIsNotAuthorizedTo]',
})
export class NotAuthorizationToggleDirective {
  constructor(
    // tslint:disable-next-line:no-any
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authorizationToggle: AuthorizationToggleService
  ) {}

  @Input() set ishIsNotAuthorizedTo(val) {
    const enabled = !this.authorizationToggle.isAuthorizedTo(val);

    if (enabled) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
