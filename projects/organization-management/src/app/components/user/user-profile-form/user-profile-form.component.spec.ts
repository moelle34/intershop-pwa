import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { CustomValidators } from 'ng2-validation';

import { coreReducers } from 'ish-core/store/core/core-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { InputComponent } from 'ish-shared/forms/components/input/input.component';
import { SelectTitleComponent } from 'ish-shared/forms/components/select-title/select-title.component';

import { UserProfileFormComponent } from './user-profile-form.component';

describe('User Profile Form Component', () => {
  let component: UserProfileFormComponent;
  let fixture: ComponentFixture<UserProfileFormComponent>;
  let element: HTMLElement;
  let fb: FormBuilder;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
        ngrxTesting({ reducers: coreReducers }),
      ],
      declarations: [
        MockComponent(ErrorMessageComponent),
        MockComponent(InputComponent),
        MockComponent(SelectTitleComponent),
        UserProfileFormComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fb = TestBed.inject(FormBuilder);

    component.form = fb.group({
      email: ['', [Validators.required, CustomValidators.email]],
    });
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display form input fields on creation', () => {
    fixture.detectChanges();

    expect(element.querySelector('[controlname=firstName]')).toBeTruthy();
    expect(element.querySelector('[controlname=lastName]')).toBeTruthy();
    expect(element.querySelector('[controlname=phone]')).toBeTruthy();
  });
});
