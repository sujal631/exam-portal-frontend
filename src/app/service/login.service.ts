import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from './helper';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  public loginStatusSubject = new Subject<boolean>();
  constructor(private http: HttpClient) {}

  // generate token
  public generateToken(loginData: any) {
    return this.http.post(`${baseUrl}/generate-token`, loginData);
  }

  //get current user that is logged in
  public getCurrentUser() {
    return this.http.get(`${baseUrl}/current-user`);
  }

  // login user: set token in local storage
  public loginUser(auth_token: any) {
    localStorage.setItem('auth_token', auth_token);
    return true;
  }

  // isLoggedIn: checking user is logged in or not
  public isLoggedIn() {
    let tokenString = localStorage.getItem('auth_token');
    if (tokenString == undefined || tokenString == '' || tokenString == null) {
      return false;
    } else {
      return true;
    }
  }

  // getToken
  public getToken() {
    return localStorage.getItem('auth_token');
  }

  // save userDetails in local storage
  public saveUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  //getUserDetails
  public getUser() {
    let userString = localStorage.getItem('user');
    if (userString != null) {
      return JSON.parse(userString);
    } else {
      this.logout();
      return null;
    }
  }

  //getUserRole (is user Admin or regular User)
  public getUserRole() {
    let user = this.getUser();
    if (user && user.authorities) {
      return user.authorities.map((auth: any) => auth.authority);
    }
    return [];
  }

  //logout: remove token from local storage
  public logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    return true;
  }

  //notification
  public notify() {
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
      title: 'Logged in successfully.',
    });
  }
}
