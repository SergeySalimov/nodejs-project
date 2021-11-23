import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IUser } from '../interfaces/i-user';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { MessageDto } from '../interfaces/interfaces.dto';
import { ROOT_URL } from '../interfaces/constant';
import { finalize } from 'rxjs/operators';
import { MessageService } from './message.service';

@Injectable()
export class UserService {
  private $isLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoaded$: Observable<boolean> = this.$isLoaded.asObservable();
  private $isUserLogged: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isUserLogged$: Observable<boolean> = this.$isUserLogged.asObservable();
  
  constructor(private readonly http: HttpClient, private readonly messageService: MessageService) {
  }
  
  changeUserState(log: boolean): void {
    this.$isUserLogged.next(log);
  }
  
  signUpWithEmail(newUser: IUser): void {
    this.$isLoaded.next(true);
    this.http.post<MessageDto>(`${ROOT_URL}/sign-up`, {user: newUser}).pipe(
      finalize(() => {
        this.$isLoaded.next(false);
      }),
    ).subscribe((data: MessageDto) => {
        this.messageService.createNewToast(data.message, true);
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
        console.log(xToken);
      },
      (data: HttpErrorResponse) => this.messageService.createNewToast(data.error.message, false),
    );
  }
  
  sendForgottenPassword(): any {
    console.log('sendForgottenPassword');
  }
}
