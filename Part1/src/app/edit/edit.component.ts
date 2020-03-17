import { Component, Input, Output, EventEmitter, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { User } from '../models/user.model';

@Component({
	selector: 'app-edit',
	templateUrl: './edit.component.html',
	styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnChanges {
	editForm: FormGroup;
	submitted = false;

	@Input() user: User;

	@Output() finishedEditing = new EventEmitter<User>();

	constructor(
		private formBuilder: FormBuilder
	) { }

	ngOnInit() {
		this._populateFields();
	}

	ngOnChanges() {
		this._populateFields();
	}

	// convenience getter for easy access to form fields
	get f() { return this.editForm.controls; }

	onSubmit() {
		this.submitted = true;

		// stop here if form is invalid
		if (this.editForm.invalid) {
			return;
		}

		let user = this.user,
			updatedUser = { ...user, ...this.editForm.value };

		this.finishedEditing.emit(updatedUser);
	}

	// notify parent to hide this component from the view
	cancel() {
		this.finishedEditing.emit();
	}

	private _populateFields() {
		this.editForm = this.formBuilder.group({
			firstName: [this.user.firstName, Validators.required],
			lastName: [this.user.lastName, Validators.required]
		});
	}
}
