import { Component } from '@angular/core';
import { LoginService } from 'src/app/service/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  user: any = null;

  constructor(private loginService: LoginService, private snack: MatSnackBar) {}

  ngOnInit(): void {
    // getting user data from local storage
    this.user = this.loginService.getUser();
  }
}
