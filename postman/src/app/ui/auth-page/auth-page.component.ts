import { Component, OnDestroy } from '@angular/core';
import { IUser } from '../../interfaces/i-user';
import { AuthEnum, RouteEnum } from '../../app-routing.constant';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss']
})
export class AuthPageComponent implements OnDestroy {
  public user: IUser = new IUser();
  public logStatus: AuthEnum = this.route.snapshot.url[0].path as AuthEnum;
  public eLog = AuthEnum;
  routeEnum = RouteEnum;
  public securityRoute = `/${RouteEnum.AUTH}/`;
  public hidePassword = true;
  private subscription: Subscription;
  
  constructor(public readonly route: ActivatedRoute, public readonly userService: UserService) {
    this.subscription.add(this.route.queryParams.subscribe((params: Params) => this.user.email = params?.email));
  }
  
  public onSubmit(): void {
    this.logStatus === this.eLog.SIGN_UP ?
      this.userService.signUpWithEmail(this.user) :
      this.userService.loginWithEmail(this.user);
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
