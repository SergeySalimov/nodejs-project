import { Component } from '@angular/core';
import { PostmanService } from '../../../services/postman.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {
  // ToDO create common loader by interceptor
  constructor(public postmanService: PostmanService, public userService: UserService) { }
}
