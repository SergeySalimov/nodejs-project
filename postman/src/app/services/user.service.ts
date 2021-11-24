import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IsUserLog, IUser } from '../interfaces/i-user';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { MessageDto } from '../interfaces/interfaces.dto';
import { ROOT_URL } from '../interfaces/constant';
import { finalize } from 'rxjs/operators';
import { MessageService } from './message.service';
import { Router } from '@angular/router';
import { AuthEnum, RouteEnum } from '../app-routing.constant';
import { environment } from '../../environments/environment';

const xTokenKey = 'xToken';

@Injectable()
export class UserService {
  private $isLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoaded$: Observable<boolean> = this.$isLoaded.asObservable();
  private $isUserLogged: BehaviorSubject<IsUserLog> = new BehaviorSubject<IsUserLog>({ log: false });
  isUserLogged$: Observable<IsUserLog> = this.$isUserLogged.asObservable();
  private $xToken: BehaviorSubject<string> = new BehaviorSubject<string>(localStorage.getItem(xTokenKey));
  private $userData: BehaviorSubject<IUser> = new BehaviorSubject<IUser>(null);
  userData$: Observable<IUser> = this.$userData.asObservable();
  
  constructor(
    private readonly http: HttpClient,
    private readonly messageService: MessageService,
    private readonly router: Router,
  ) {
  }
  
  signUpWithEmail(newUser: IUser): void {
    this.$isLoaded.next(true);
    this.http.post<MessageDto>(`${ROOT_URL}/sign-up`, {user: newUser}).pipe(
      finalize(() => {
        this.$isLoaded.next(false);
      }),
    ).subscribe((data: MessageDto) => {
        this.messageService.createNewToast(data.message, true);
        this.router.navigateByUrl(`/${RouteEnum.AUTH}/${AuthEnum.LOG_IN}`);
      },
      (data: HttpErrorResponse) => this.messageService.createNewToast(data.error.message, false),
    );
  }
  
  loginWithEmail(user: IUser): void {
    this.$isLoaded.next(true);
    this.http.post<any>(`${ROOT_URL}/sign-in`, {user}, { observe: 'response' }).pipe(
      finalize(() => {
        this.$isLoaded.next(false);
      }),
    ).subscribe((data: HttpResponse<any>) => {
        const xToken = data.headers.get('X-Token');
        if (xToken) {
          this.$isUserLogged.next({ log: true });
          localStorage.setItem(xTokenKey, JSON.stringify(xToken));
          this.router.navigateByUrl(environment.URL_AFTER_LOGIN);
          this.messageService.createNewToast(data.body.message, true);
          this.$userData.next(data.body.user);
        }
        console.log(xToken);
      },
      (data: HttpErrorResponse) => this.messageService.createNewToast(data.error.message, false),
    );
  }
  
  sendForgottenPassword(): any {
    console.log('sendForgottenPassword');
  }
  
  logOut():void {
    this.$isUserLogged.next({ log: false });
    this.router.navigateByUrl(`/${RouteEnum.AUTH}/${AuthEnum.LOG_IN}`);
  }
}
