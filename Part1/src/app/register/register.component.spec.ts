import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        RouterTestingModule,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('exists', () => {
    expect(component).toBeTruthy();
  });

  it('should error on empty required field', () => {
    let username = component.registerForm.controls.username;
    username.setValue('')
    expect(username.hasError('required')).toBeTruthy();
  });

  it('should call submit on button click', () => {
    spyOn(component, 'onSubmit');
    let el = fixture.debugElement.nativeElement;
    el.querySelector('button').click();
    expect(component.onSubmit).toHaveBeenCalledTimes(1);
  });

  it('should be invalid when password is less than 6 chars', () => {
    component.registerForm.controls.firstName.setValue('test');
    component.registerForm.controls.lastName.setValue('test');
    component.registerForm.controls.username.setValue('tester');
    component.registerForm.controls.password.setValue('12345');
    expect(component.registerForm.valid).toBeFalsy();
  });
});
