import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class UserService {
  private $isUserLogged: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isUserLogged$: Observable<boolean> = this.$isUserLogged.asObservable();

  constructor() { }
  
  changeUserState(log: boolean): void {
    this.$isUserLogged.next(log);
  }
  
  signUpWithEmail() {
    console.log('signUpWithEmail');
  }
  loginWithEmail() {
    console.log('loginWithEmail');
  }
  sendForgottenPassword() {
    console.log('sendForgottenPassword');
  }
}
