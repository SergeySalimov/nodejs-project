import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from '../../interfaces/i-user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-options-page',
  templateUrl: './options-page.component.html',
  styleUrls: ['./options-page.component.scss']
})
export class OptionsPageComponent {
    user$: Observable<IUser> = this.userService.userData$;
  constructor(private readonly userService: UserService) { }
}
