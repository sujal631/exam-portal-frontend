import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root',
})
export class UserGuard implements CanActivate {
  constructor(private loginService: LoginService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const roles = this.loginService.getUserRole();
    if (this.loginService.isLoggedIn() && roles.includes('USER')) {
      return true;
    }
    // if not logged in or not an admin, so return false
    this.loginService.logout();
    // window.location.reload();
    this.router.navigate(['/login']);
    this.loginService.loginStatusSubject.next(false);
    return false;
  }
}
