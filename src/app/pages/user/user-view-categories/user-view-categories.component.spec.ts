import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserViewCategoriesComponent } from './user-view-categories.component';

describe('UserViewCategoriesComponent', () => {
  let component: UserViewCategoriesComponent;
  let fixture: ComponentFixture<UserViewCategoriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserViewCategoriesComponent]
    });
    fixture = TestBed.createComponent(UserViewCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
