import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/service/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(
    private snack: MatSnackBar,
    private loginService: LoginService,
    private router: Router
  ) {}

  loginData = {
    userName: '',
    password: '',
  };

  handleSubmit() {
    console.log('Clicked');
    if (
      this.loginData.userName.trim() == '' ||
      this.loginData.userName.trim() == null ||
      this.loginData.password.trim() == '' ||
      this.loginData.password.trim() == null
    ) {
      this.snack.open('Please fill out all the required fields.', 'OK', {
        duration: 3500,
        politeness: 'polite',
      });
      return;
    }

    //request server to generate token
    this.loginService.generateToken(this.loginData).subscribe(
      (data: any) => {
        console.log('Log In successful');
        console.log(data);

        //log in
        this.loginService.loginUser(data.token);
        this.loginService.getCurrentUser().subscribe((user: any) => {
          console.log('Inside getCurrentUser subscription');
          console.log(user);
          this.loginService.saveUser(user);

          //redirect ... ADMIN -> admin dashboard
          //redirect ... USER -> user dashboard
          const roles = this.loginService.getUserRole();

          if (roles.includes('ADMIN') && roles.includes('USER')) {
            // Prompt the user with a choice
            Swal.fire({
              title: 'Choose Dashboard',
              text: 'How would you like to log in?',
              icon: 'question',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Admin',
              cancelButtonText: 'User',
            }).then((result) => {
              if (result.isConfirmed) {
                // Admin choice
                localStorage.setItem('currentRole', 'ADMIN');
                this.router.navigate(['admin-dashboard/profile']);
                this.loginService.loginStatusSubject.next(true);
                this.loginService.notify();
              } else if (
                result.dismiss === Swal.DismissReason.cancel ||
                result.dismiss === Swal.DismissReason.backdrop
              ) {
                // User choice
                localStorage.setItem('currentRole', 'USER');
                this.router.navigate(['/user-dashboard/profile']);
                this.loginService.loginStatusSubject.next(true);
                this.loginService.notify();
              }
            });
          } else if (roles.includes('ADMIN')) {
            //admin dashboard
            console.log('Navigating to /admin-dashboard');
            this.router.navigate(['admin-dashboard/profile']);
            this.loginService.loginStatusSubject.next(true);
            this.loginService.notify();
          } else if (roles.includes('USER')) {
            //user dashboard
            console.log('Navigating to /user-dashboard');
            this.router.navigate(['user-dashboard/profile']);
            this.loginService.loginStatusSubject.next(true);
            this.loginService.notify();
          } else {
            console.log('Invalid role, logging out');
            this.loginService.logout();
          }
        });
      },
      (error) => {
        console.log(error);
        this.snack.open(
          'Invalid Username or Password. Please try again.',
          'OK',
          {
            duration: 3500,
            politeness: 'polite',
            panelClass: 'snack-bar-error',
          }
        );
      }
    );
  }
}
