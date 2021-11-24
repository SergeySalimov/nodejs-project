import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { map, take } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  constructor(private readonly userService: UserService, private readonly router: Router) {
  }
  canActivate(): Observable<boolean | UrlTree> {
    return this.userService.isUserLogged$.pipe(
      take(1),
      map(isUserLogged => isUserLogged.log ? this.router.createUrlTree([environment.URL_AFTER_LOGIN]) : true),
    );
  }
}
