import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { UploadFileDto } from '../../interfaces/interfaces.dto';
import { PostmanService } from '../../services/postman.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-storage-page',
  templateUrl: './storage-page.component.html',
  styleUrls: ['./storage-page.component.scss']
})
export class StoragePageComponent {
  uploadListData$: Observable<UploadFileDto[]> = this.ps.uploadFileList$;
  FILES_LIMIT = environment.FILES_LIMIT;
  constructor(private readonly ps: PostmanService) { }
}
