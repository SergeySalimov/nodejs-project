import { Component, Input, OnInit } from '@angular/core';
import { ResponseDto } from '../../../interfaces/interfaces.dto';

@Component({
  selector: 'app-work-response-block',
  templateUrl: './response-block.component.html',
  styleUrls: ['./response-block.component.scss']
})
export class ResponseBlockComponent implements OnInit {
  @Input() response!: ResponseDto;

  get color(): string {
    const responseFirstNumber = +String(this.response?.status)[0];

    switch (responseFirstNumber) {
      case 1:
        return 'gray';
      case 2:
        return '#0bdd0b';
      case 3:
        return 'yellow';
      case 4:
      case 5:
        return 'red';
      default:
        return 'black';
    }
  }

  get responseText(): string[] {
    return this.response?.responseText.split('\n') || [];
  }

  constructor() {
  }

  ngOnInit(): void {
  }

}
