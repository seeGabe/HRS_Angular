import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '../models/user.model';
import { UserService, AuthenticationService } from '../services';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
	currentUser: User;
	users = [];

	// value passed into edit component as an input attribute
	selectedUser: User;

	constructor(
		private authenticationService: AuthenticationService,
		private userService: UserService
	) {
		this.currentUser = this.authenticationService.currentUserValue;
	}

	ngOnInit() {
		this.loadAllUsers();
	}

	deleteUser(id: number) {
		this.userService.delete(id)
			.pipe(first())
			.subscribe(() => this.loadAllUsers());
	}

	// assign the value used inside of the edit component
	editUser(user: User) {
		this.selectedUser = user;
	}

	updateUsers(user) {
		this.userService.edit(user)
			.pipe(first())
			.subscribe(() => {
				// reset this value to hide the edit component
				this.selectedUser = undefined;
				this.loadAllUsers();
			});
	}

	private loadAllUsers() {
		this.userService.getAll()
			.pipe(first())
			.subscribe(users => this.users = users);
	}

}
