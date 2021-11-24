import { Component } from '@angular/core';
import { AuthEnum, RouteEnum } from '../../app-routing.constant';
import { UserService } from '../../services/user.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogOnActionComponent } from '../shared/dialog-on-action/dialog-on-action.component';
import { take } from 'rxjs/operators';
import { EYesOrNo } from '../../interfaces/constant';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  route = RouteEnum;
  auth = AuthEnum;
  public eYesOrNo = EYesOrNo;
  constructor(public readonly userService: UserService, private readonly dialog: MatDialog) {}
  
  public onLogout(): void {
    const dialogRef: MatDialogRef<DialogOnActionComponent> = this.dialog.open(DialogOnActionComponent, {
      width: '300px',
      disableClose: true,
      autoFocus: true,
      data: { text: 'Вы уверены, что хотите выйти?'},
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe((data: EYesOrNo) => {
      if (data === this.eYesOrNo.YES) {
        this.userService.logOut(); }
    });
  }
}
