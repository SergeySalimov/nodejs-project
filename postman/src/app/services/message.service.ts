import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class MessageService {
  private $infoMessage: BehaviorSubject<string | null> = new BehaviorSubject<string>(null);
  private $errorMessage: BehaviorSubject<string | null> = new BehaviorSubject<string>(null);
  infoMessage$: Observable<string> = this.$infoMessage.asObservable();
  errorMessage$: Observable<string> = this.$errorMessage.asObservable();
  
  createNewToast(text: string, info: boolean): void {
    info ? this.$infoMessage.next(text) : this.$errorMessage.next(text);
  }
}
