import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { UploadStatusEnum } from '../../../interfaces/constant';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PostmanService } from '../../../services/postman.service';
import { finalize, takeUntil } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { fileSizeValidator } from './file-size.validator';

@Component({
  selector: 'app-storage-page-upload',
  templateUrl: './storage-page-upload.component.html',
  styleUrls: ['./storage-page-upload.component.scss']
})
export class StoragePageUploadComponent implements OnInit, OnDestroy {
  progress$: Observable<number> = this.postmanService.uploadProgress$;
  disableUploadButton$: Observable<boolean> = this.postmanService.disableLoadButton$;
  private destroy$ = new Subject<void>();
  uploadStatus: UploadStatusEnum;
  uploadForm: FormGroup;
  files: FileList;
  
  get filesInput(): FormControl {
    return this.uploadForm.get('files') as FormControl;
  }

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly postmanService: PostmanService,
    ) {}

  ngOnInit(): void {
    this.uploadForm = this.formBuilder.group({
      files: [null, Validators.required],
      comments: [''],
    });
    this.uploadStatus = UploadStatusEnum.READY;
  }

  getClassForProgressBar(): string {
    switch (this.uploadStatus) {
      case UploadStatusEnum.READY:
      case UploadStatusEnum.PROGRESS:
        return 'bg-primary';
      case UploadStatusEnum.DONE:
        return 'bg-success';
      case UploadStatusEnum.ERROR:
        return 'bg-danger';
      default:
        return 'bg-primary';
    }
  }

  onSubmitUpload(): void {
    // ToDo need to add here real session token
    const sessionToken: string = 'TOKEN:' + (Date.now().toString(36) + Math.random().toString(36).substring(2, 15));

    // open webSocket
    const wsUrl: string = environment.webSocketUrl;
    const connection: WebSocket = new WebSocket(wsUrl);

    connection.onopen = () => {
      connection.send(sessionToken);
    };
    connection.onmessage = (event) => {
      const message: string = event.data;
      if (message.startsWith('progress:')) {
        const progress: string = message.slice(9);
        this.postmanService.$uploadProgress.next(+progress);
      } else if (message.startsWith('321start')) {
        this.uploadStatus = UploadStatusEnum.PROGRESS;
        const { comments } = this.uploadForm.getRawValue();
        this.uploadForm.disable();
        this.postmanService.uploadFiles(this.files[0], comments, sessionToken).pipe(
          finalize(() => {
            setTimeout(() => this.uploadStatus = UploadStatusEnum.DONE, 500);
            this.uploadForm.reset({ files: null, comments: ''});
            this.postmanService.getUploadFileList();
            this.uploadForm.enable();
          }),
          takeUntil(this.destroy$),
        ).subscribe();
      }
    };
    // connection.onerror = (event) => {
    //   console.log(event);
    // };
  }

  prepareFiles(files: FileList): void {
    if (files?.item(0)) {
      this.filesInput.setValidators([fileSizeValidator(files)]);
      this.filesInput.updateValueAndValidity();
      this.files = files;
    } else {
      this.filesInput.reset();
    }
  }

  resetUploadProgress(): void {
    this.uploadStatus = UploadStatusEnum.READY;
    this.postmanService.$uploadProgress.next(0);
  }

  ngOnDestroy(): void {
    this.resetUploadProgress();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
