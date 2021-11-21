import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HistoryDto } from '../../../interfaces/interfaces.dto';
import { RequestTypeEnum } from '../../../interfaces/constant';

@Component({
  selector: 'app-work-history-block',
  templateUrl: './history-block.component.html',
  styleUrls: ['./history-block.component.scss']
})
export class HistoryBlockComponent {
  @Input() histories: HistoryDto;
  @Input() activeHistoryId: string;
  @Output() deleteHistoryEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() changeHistoryEmit: EventEmitter<string> = new EventEmitter<string>();
  TYPE = RequestTypeEnum;
}
