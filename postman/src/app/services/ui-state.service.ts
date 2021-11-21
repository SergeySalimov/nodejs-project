import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class UiStateService {
  $showHistory: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  showHistory$: Observable<boolean> = this.$showHistory.asObservable();
  $disableSendRequestButton: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  disableSendRequestButton$: Observable<boolean> = this.$showHistory.asObservable();

  changeHistory(newState: boolean): void {
    this.$showHistory.next(newState);
  }

  setDisableSendRequestButton(newState: boolean): void {
    this.$disableSendRequestButton.next(newState);
  }
}
