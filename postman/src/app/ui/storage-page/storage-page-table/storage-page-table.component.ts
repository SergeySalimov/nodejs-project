import { Component, OnInit } from '@angular/core';
import { PostmanService } from '../../../services/postman.service';
import { UploadFileDto } from '../../../interfaces/interfaces.dto';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-storage-page-table',
  templateUrl: './storage-page-table.component.html',
  styleUrls: ['./storage-page-table.component.scss']
})
export class StoragePageTableComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'size', 'comment', 'action'];
  uploadListData$: Observable<UploadFileDto[]> = this.ps.uploadFileList$;

  constructor(private readonly ps: PostmanService) { }

  ngOnInit(): void {
    this.ps.getUploadFileList();
  }

  loadFile(id: string, fileName: string): void {
    this.ps.downloadFile(id, fileName);
  }

  deleteFile(id: string): void {
    this.ps.deleteDownloadedFile(id).subscribe( () => this.ps.getUploadFileList());
  }
}
