import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountLoginService } from '../../services/account-login/account-login.service';
import { EmailValidator } from '../../validators/email.validator';
import { CacheCustomService } from '../../services/cache/cache-custom.service';
import { LocalizeRouterService } from '../../services/routes-parser-locale-currency/localize-router.service';

@Component({
  templateUrl: './account-login.component.html'
})

export class AccountLoginComponent implements OnInit {
  loginForm: FormGroup;
  loginToUse = false;
  loginFormSubmitted: boolean;
  errorUser: any;
  registrationLoginType = 'email';
  isLoggedIn;
  defaultResponse = '401 and Unauthorized';
  /**
   * Constructor
   * @param  {FormBuilder} privateformBuilder
   * @param  {AccountLoginService} privateaccountLoginService
   * @param  {Router} privaterouter
   */
  constructor(private formBuilder: FormBuilder, private accountLoginService: AccountLoginService,
    private router: Router, private cacheService: CacheCustomService, private localize: LocalizeRouterService) { }

  /**
     * Creates Login Form
     */
  ngOnInit() {
    this.isLoggedIn = this.cacheService.cacheKeyExists('userDetail');
    this.loginForm = this.formBuilder.group({
      userName: ['', [Validators.compose([Validators.required,
      (this.registrationLoginType === 'email' ? EmailValidator.validate : null)])]],
      password: ['', Validators.required],
    });
  }

  /**
   * Routes to Family Page when user is logged in
   */
  onSignin(userCredentials) {
    if (this.loginForm.invalid) {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key).markAsDirty();
      });
    } else {
      this.loginFormSubmitted = true;
      this.accountLoginService.singinUser(userCredentials).subscribe(userData => {
        if (userData && typeof userData !== 'string') {
          this.router.navigate([this.localize.translateRoute('/home')]);
        } else {
          this.loginForm.get('password').reset();
          this.errorUser = userData || this.defaultResponse;
        }
      });
    }
  }
}

