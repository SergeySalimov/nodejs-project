import { Component, OnDestroy, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs';
import { MessageService } from '../../../services/message.service';
import { TIMER_FOR_ERROR_MESSAGE, TIMER_FOR_INFO_MESSAGE } from '../../../interfaces/constant';

@Component({
  selector: 'app-info-error-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  animations: [
    trigger('openCloseSmoothly', [
      transition(':enter', [
        style({opacity: 0}),
        animate('300ms', style({opacity: 1})),
      ]),
      transition(':leave', [
        style({opacity: 1}),
        animate('300ms', style({opacity: 0})),
      ]),
    ]),
  ],
})
export class AlertComponent implements OnInit, OnDestroy {
  public isAlertErrorShown: boolean;
  public isAlertInfoShown: boolean;
  public timerErrorValue: number;
  public timerInfoValue: number;
  public errorMessage$ = this.messageService.errorMessage$;
  public infoMessage$ = this.messageService.infoMessage$;
  private intervalErrorId: number;
  private intervalInfoId: number;
  private subscriptionForError: Subscription;
  private subscriptionForInfo: Subscription;
  
  constructor(private readonly messageService: MessageService) {
  }
  
  ngOnInit(): void {
    this.subscriptionForError = this.messageService.errorMessage$.subscribe((error: string | null) =>
      error ? this.openErrorWindow() : this.closeErrorWindow());
    this.subscriptionForInfo = this.infoMessage$.subscribe((info: string | null) =>
      info ? this.openInfoWindow() : this.closeInfoWindow());
  }
  
  public openInfoWindow(): void {
    this.isAlertInfoShown = true;
    this.timerInfoValue = 100;
    this.intervalInfoId = setInterval(() => {
      this.timerInfoValue > 0 ? this.timerInfoValue-- : this.closeInfoWindow();
    }, TIMER_FOR_INFO_MESSAGE * 1000 / 100);
  }
  
  public openErrorWindow(): void {
    this.isAlertErrorShown = true;
    this.timerErrorValue = 100;
    this.intervalErrorId = setInterval(() => {
      this.timerErrorValue > 0 ? this.timerErrorValue-- : this.closeErrorWindow();
    }, TIMER_FOR_ERROR_MESSAGE * 1000 / 100);
  }
  
  public closeErrorWindow(): void {
    clearInterval(this.intervalErrorId);
    this.isAlertErrorShown = false;
  }
  
  public closeInfoWindow(): void {
    clearInterval(this.intervalInfoId);
    this.isAlertInfoShown = false;
  }
  
  ngOnDestroy(): void {
    if (this.intervalErrorId) {
      this.closeErrorWindow();
    }
    if (this.intervalInfoId) {
      this.closeInfoWindow();
    }
    this.subscriptionForError.unsubscribe();
    this.subscriptionForInfo.unsubscribe();
  }
}
