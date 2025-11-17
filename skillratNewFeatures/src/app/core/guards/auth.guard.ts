import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthserviceService } from '../../auth/authservice/authservice.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthserviceService, private router: Router) {}

  private isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (this.isAuthenticated()) {
      return true;
    }
    return this.router.parseUrl('/auth/login');
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree {
    if (this.isAuthenticated()) {
      return true;
    }
    return this.router.parseUrl('/auth/login');
  }
}
