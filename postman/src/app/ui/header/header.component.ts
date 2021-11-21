import { Component } from '@angular/core';
import { RouteEnum } from '../../app-routing.constant';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  route = RouteEnum;
}
