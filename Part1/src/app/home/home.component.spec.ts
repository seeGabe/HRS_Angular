import { TestBed, ComponentFixture, async } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { User } from '../models/user.model';
import { EditComponent } from '../edit/edit.component';
import { HttpClientModule } from '@angular/common/http';

describe('HomeComponent', () => {
	let component: HomeComponent;
	let component2: EditComponent;
	let fixture: ComponentFixture<HomeComponent>;
	let fixture2: ComponentFixture<EditComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				HomeComponent,
				EditComponent
			],
			imports: [
				FormsModule,
				ReactiveFormsModule,
				HttpClientModule
			]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		const userList: Array<User> = 
		[{
			id: 1,
			firstName: 'test',
			lastName: 'test',
			password: 'test',
			username: 'test',
			token: 'test'
		},{
			id: 2,
			firstName: 'test',
			lastName: 'test',
			password: 'test',
			username: 'test',
			token: 'test'
		}];

		fixture = TestBed.createComponent(HomeComponent);
		fixture2 = TestBed.createComponent(EditComponent);

		component = fixture.componentInstance;
		component.users = userList;
		component.currentUser = userList[0];

		component2 = fixture2.componentInstance;
		component2.user = userList[0];

		fixture.detectChanges();
		fixture2.detectChanges();
	});

	it('exists', () => {
		expect(component).toBeTruthy();
	});
});