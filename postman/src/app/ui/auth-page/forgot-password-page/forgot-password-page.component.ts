import { Component, OnDestroy, OnInit } from '@angular/core';
import { EYesOrNo } from '../../../interfaces/constant';
import { AuthEnum, RouteEnum } from '../../../app-routing.constant';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../services/user.service';
import { DialogOnActionComponent } from '../../shared/dialog-on-action/dialog-on-action.component';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-forgot-password-page',
  templateUrl: './forgot-password-page.component.html',
  styleUrls: ['./forgot-password-page.component.scss']
})
export class ForgotPasswordPageComponent implements OnInit, OnDestroy {
  public eYesOrNo = EYesOrNo;
  public eLog = AuthEnum;
  public securityRoute = `/${RouteEnum.AUTH}/`;
  public emailForReset: string;
  private subscription: Subscription;
  
  constructor(
    private readonly route: ActivatedRoute,
    private readonly dialog: MatDialog,
    private readonly userService: UserService,
  ) {}
  
  ngOnInit(): void {
    this.subscription = this.route.queryParams.subscribe((params: Params) => this.emailForReset = params?.email);
  }
  
  public onSubmit() {
    const dialogRef: MatDialogRef<DialogOnActionComponent> = this.dialog.open(DialogOnActionComponent, {
      width: '300px',
      disableClose: true,
      autoFocus: true,
      data: { text: `Вы уверены, что вы хотите восстановить пароль для ящика <${this.emailForReset}>?` },
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe((data: EYesOrNo) => {
      if (data === this.eYesOrNo.YES) {
        this.userService.sendForgottenPassword();
      }
    });
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
