import { Component } from '@angular/core';
import { AuthEnum, RouteEnum } from '../../app-routing.constant';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  route = RouteEnum;
  auth = AuthEnum;
  constructor(public readonly userService: UserService) {}
}
