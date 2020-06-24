import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { AuthorizationToggleModule } from 'ish-core/authorization-toggle.module';

@Component({
  template: `
    <div>unrelated</div>
    <div *ishIsNotAuthorizedTo="'DO_THIS'">content1</div>
    <div *ishIsNotAuthorizedTo="'DO_THAT'">content2</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestComponent {}

describe('Not Authorization Toggle Directive', () => {
  let fixture: ComponentFixture<TestComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [AuthorizationToggleModule.forTesting('DO_THIS')],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should always render unrelated content', () => {
    expect(element.textContent).toContain('unrelated');
  });

  it('should not render content if permission was granted', () => {
    expect(element.textContent).not.toContain('content1');
  });

  it('should render content if not permitted', () => {
    expect(element.textContent).toContain('content2');
  });
});
