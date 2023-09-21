import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/service/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-sidebar',
  templateUrl: './user-sidebar.component.html',
  styleUrls: ['./user-sidebar.component.css'],
})
export class UserSidebarComponent {
  isLoggedIn = false;
  user: any = null;

  constructor(private loginService: LoginService, private router: Router) {}

  ngOnInit(): void {
    this.isLoggedIn = this.loginService.isLoggedIn();
    this.user = this.loginService.getUser();
    this.loginService.loginStatusSubject.asObservable().subscribe((data) => {
      this.isLoggedIn = this.loginService.isLoggedIn();
      this.user = this.loginService.getUser();
    });
  }
  public logout() {
    this.loginService.logout();
    // window.location.reload();
    this.router.navigate(['/login']);
    this.loginService.loginStatusSubject.next(false);
    const Toast = Swal.mixin({
      toast: true,
      position: 'bottom',
      showConfirmButton: false,
      timer: 3500,
      timerProgressBar: true,
      didOpen: (toast: any) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
    Toast.fire({
      icon: 'success',
      title: 'Logged out successfully.',
    });
  }
}
