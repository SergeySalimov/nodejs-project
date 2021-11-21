import { Component, OnInit, ViewChild } from '@angular/core';
import { RequestForm } from '../../interfaces/interfaces.vm';
import { PostmanService } from '../../services/postman.service';
import { History, HistoryDto, RequestDto } from '../../interfaces/interfaces.dto';
import { WorkPageHelper } from './work-page.helper';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { distinctUntilChanged, filter, map, pluck } from 'rxjs/operators';
import { RouteEnum } from '../../app-routing.constant';

@Component({
  selector: 'app-work-page',
  templateUrl: './work-page.component.html',
  styleUrls: ['./work-page.component.scss']
})
export class WorkPageComponent implements OnInit {
  showHistory = true;
  ROUTES = RouteEnum;
  showHistory$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  disableSendRequest$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  activeHistoryId$: Observable<string> = this.route.params.pipe(
    pluck('id'),
    distinctUntilChanged(),
  );
  requestFormPatch$: Observable<RequestForm> = combineLatest([
    this.postmanService.history$,
    this.activeHistoryId$,
  ]).pipe(
    map(([histories, activeHistoryId]: [HistoryDto, string]) => histories.find(history => history.id === activeHistoryId)),
    filter(Boolean),
    map(activeHistory => WorkPageHelper.translateHistoryToFormData(activeHistory as History)),
  );

  @ViewChild('requestBlockComponent', { static: true }) requestBlock: any;

  constructor(
    public postmanService: PostmanService,
    public route: ActivatedRoute,
    public router: Router,
  ) {
  }

  ngOnInit(): void {
    this.postmanService.getHistory();
  }

  sendRequest(data: RequestForm): void {
    const req: RequestDto = WorkPageHelper.translateFormDataToRequestDto(data);
    this.navigateOnHistory(data.id);
    this.postmanService.sendRequest(req);
  }

  onDeleteHistory(id: string): void {
    this.postmanService.deleteHistory(id).subscribe(() => {
      this.router.navigateByUrl('/' + RouteEnum.WORK);
      this.postmanService.getHistory();
    });
  }

  navigateOnHistory(id: string): void {
    this.router.navigateByUrl(`/${RouteEnum.WORK}/${id}`).then(() => {
      this.requestBlock.getIsInvalidOnChangeInForm();
    });
  }

  onHideShowHistory(): void {
    const currentState = this.showHistory$.getValue();
    this.showHistory$.next(!currentState);
  }

  onRequestFormStatusChange(status: boolean): void {
    setTimeout(() => this.disableSendRequest$.next(status));
  }
}
