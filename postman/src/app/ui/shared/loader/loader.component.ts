import { Component } from '@angular/core';
import { PostmanService } from '../../../services/postman.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {
  constructor(public postmanService: PostmanService) { }
}
