import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EditComponent } from './edit.component';
import { User } from '../models/user.model';

describe('EditComponent', () => {
	let component: EditComponent;
	let fixture: ComponentFixture<EditComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [EditComponent],
			imports: [
				FormsModule,
				ReactiveFormsModule
			]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		let user: User = {
			id: 1,
			firstName: 'test',
			lastName: 'test',
			password: 'test',
			username: 'test',
			token: 'test'
		};

		fixture = TestBed.createComponent(EditComponent);
		component = fixture.componentInstance;
		component.user = user;

		fixture.detectChanges();
	});

	it('exists', () => {
		expect(component).toBeTruthy();
	});

	it('should be invalid when fields are empty', () => {
		component.editForm.controls.firstName.setValue('');
		component.editForm.controls.lastName.setValue('');
		expect(component.editForm.valid).toBeFalsy();
	});

	it('should submit on button click', () => {
		spyOn(component, 'onSubmit');
		let el = fixture.debugElement.nativeElement;
		el.querySelector('button').click();
		expect(component.onSubmit).toHaveBeenCalled();
	})
});
