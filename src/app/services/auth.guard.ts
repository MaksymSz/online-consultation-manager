import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return this.authService.currentUserRole$.pipe(
      take(1),
      map(role => {
        const requiredRole = next.data['roles'];  // Role specified in route
        if (requiredRole.includes(role)) {
          return true;  // User has the required role, so allow access
        }else if (requiredRole.includes('any') && role){
          return true;
        }

        // If the user doesn't have the right role, redirect them
        this.router.navigate(['/']);
        return false;
      })
    );
  }
}
