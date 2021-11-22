import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HistoryDto, RequestDto, ResponseDto, UploadFileDto } from '../interfaces/interfaces.dto';
import { finalize, map } from 'rxjs/operators';
import { saveAs as importedSaveAs } from 'file-saver';
import { MessageService } from './message.service';
import { ROOT_URL } from '../interfaces/constant';

@Injectable()
export class PostmanService {
  private $isLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoaded$: Observable<boolean> = this.$isLoaded.asObservable();
  private $history: BehaviorSubject<HistoryDto> = new BehaviorSubject<HistoryDto>([]);
  history$: Observable<HistoryDto> = this.$history.asObservable();
  private $response: Subject<ResponseDto> = new Subject<ResponseDto>();
  response$: Observable<ResponseDto> = this.$response.asObservable();
  $uploadProgress: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  uploadProgress$: Observable<number> = this.$uploadProgress.asObservable();
  private $disableLoadButton: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  disableLoadButton$: Observable<boolean> = this.$disableLoadButton.asObservable();
  $uploadFileList: BehaviorSubject<UploadFileDto[]> = new BehaviorSubject<UploadFileDto[]>([]);
  uploadFileList$: Observable<UploadFileDto[]> = this.$uploadFileList.asObservable();

  constructor(private readonly http: HttpClient, private readonly messageService: MessageService) {}

  sendRequest(req: RequestDto): void {
    this.$isLoaded.next(true);
    this.http.post<ResponseDto>(`${ROOT_URL}/requests`, req).pipe(
      finalize(() => {
        this.$isLoaded.next(false);
        this.getHistory();
      }),
    ).subscribe((data: ResponseDto) => this.$response.next(data));
  }

  getHistory(): void {
    this.$isLoaded.next(true);
    this.http.get<HistoryDto>(`${ROOT_URL}/histories`).pipe(
      finalize(() => this.$isLoaded.next(false)),
    ).subscribe((data: HistoryDto) => this.$history.next(data?.reverse() || []));
  }

  deleteHistory(id: string): Observable<void> {
    this.$isLoaded.next(true);
    return this.http.delete<void>(`${ROOT_URL}/histories/${id}`).pipe(
      finalize(() => this.$isLoaded.next(false)),
    );
  }

  getUploadFileList(): void {
    this.$isLoaded.next(true);
    this.http.get<UploadFileDto[]>(`${ROOT_URL}/list-of-upload-files`).pipe(
      finalize(() => this.$isLoaded.next(false)),
      map((data: UploadFileDto[]) => data?.map((el, i) => ({ ...el, position: i + 1 })) || []),
    ).subscribe(data => {
      this.$uploadFileList.next(data);
    });
  }

  downloadFile(id: string, fileName: string): void {
    this.http.get<void>(`${ROOT_URL}/upload-file/${id}`, { responseType: 'blob' as any})
      .toPromise()
      .then(blob => importedSaveAs(blob, fileName))
      .catch(err => this.messageService.createNewToast('Ошибка при загрузке файла', false));
  }

  deleteDownloadedFile(id: string): Observable<void> {
    this.$isLoaded.next(true);
    return this.http.delete<void>(`${ROOT_URL}/upload-file/${id}`).pipe(
      finalize(() => {
        this.$isLoaded.next(false);
        this.messageService.createNewToast('Файл был успешно удален с сервера', true);
      }),
    );
  }

  uploadFiles(file: File, comment: string, sessionToken: string): Observable<UploadFileDto> {
    this.$disableLoadButton.next(true);

    const formData: FormData = new FormData();
    const fileLength: string = file.size.toString();

    formData.append('file', file);
    formData.append('comment', comment);

    return this.http.post<UploadFileDto>(
      `${ROOT_URL}/upload-file`,
      formData,
      {
        headers: {
          'custom-token': sessionToken,
          'file-length': fileLength,
        },
      },
    ).pipe(
      finalize(() => {
        this.$disableLoadButton.next(false);
        this.messageService.createNewToast('Файл был успешно загружен на сервер', true);
      }),
    );
  }
}
