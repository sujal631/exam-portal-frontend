import { Component } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  constructor(
    private userService: UserService,
    private snack: MatSnackBar,
    private router: Router
  ) {}
  public user = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    userName: '',
    password: '',
  };

  //regular expressions for validation
  emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,4}$/;
  phonePattern = /^[0-9]{10}$/;
  passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&#]{8,}$/;

  handleSubmit() {
    // validating if any of the fields is left blank
    if (
      this.user.firstName == '' ||
      this.user.lastName == '' ||
      this.user.phoneNumber == '' ||
      this.user.email == '' ||
      this.user.userName == '' ||
      this.user.password == ''
    ) {
      this.snack.open('Please fill out all the required fields.', 'OK', {
        duration: 3500,
        politeness: 'polite',
        panelClass: 'snack-bar-error',
      });
      return;
    }

    // validating if the phoneNumber matches the required pattern
    if (!this.phonePattern.test(this.user.phoneNumber)) {
      this.snack.open('Invalid phone number!', 'OK', {
        duration: 3500,
        politeness: 'polite',
        panelClass: 'snack-bar-error',
      });
      return;
    }

    // validating email
    if (!this.emailPattern.test(this.user.email)) {
      this.snack.open('Invalid e-mail address!', 'OK', {
        duration: 3500,
        politeness: 'polite',
        panelClass: 'snack-bar-error',
      });
      return;
    }

    // validating password
    if (!this.passwordPattern.test(this.user.password)) {
      this.snack.open('Invalid password format!', 'OK', {
        duration: 3500,
        politeness: 'polite',
        panelClass: 'snack-bar-error',
      });
      return;
    }

    this.userService.addUser(this.user).subscribe(
      (data) => {
        //success
        console.log(data);
        //alert('Registration successful!');
        this.router.navigate(['/login']);

        const Toast = Swal.mixin({
          toast: true,
          position: 'bottom',
          showConfirmButton: false,
          timer: 3500,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          },
        });
        Toast.fire({
          icon: 'success',
          title: 'Registered successfully.',
        });
      },
      (error) => {
        //error
        console.log(error);
        console.log(this.user);
        //alert('Something went wrong!');
        this.snack.open('Something went wrong. Please try again.', 'OK', {
          duration: 3500,
          politeness: 'polite',
          panelClass: 'snack-bar-error',
        });
      }
    );
  }
}
