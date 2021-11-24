import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { map, take } from 'rxjs/operators';
import { AuthEnum, RouteEnum } from '../app-routing.constant';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private readonly userService: UserService, private readonly router: Router) {
  }
  canActivate(): Observable<boolean | UrlTree> {
    return this.userService.isUserLogged$.pipe(
      take(1),
      map(isUserLogged => isUserLogged.log ? true : this.router.createUrlTree([`/${RouteEnum.AUTH}/${AuthEnum.LOG_IN}`])),
    );
  }
}
