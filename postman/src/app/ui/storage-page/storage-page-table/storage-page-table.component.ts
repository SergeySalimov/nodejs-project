import { Component, HostListener, OnInit } from '@angular/core';
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
  nameSliceRange = 50;
  
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.getNameSliceRange(window.innerWidth);
  }

  constructor(private readonly ps: PostmanService) { }

  ngOnInit(): void {
    this.ps.getUploadFileList();
    this.getNameSliceRange(window.innerWidth);
  }

  loadFile(id: string, fileName: string): void {
    this.ps.downloadFile(id, fileName);
  }

  deleteFile(id: string): void {
    this.ps.deleteDownloadedFile(id).subscribe( () => this.ps.getUploadFileList());
  }
  
  getNameSliceRange(width: number): void {
    if (width > 1200) {
      this.nameSliceRange = 50;
    } else if (width > 900 && width <= 1200) {
      this.nameSliceRange = 40;
    } else if (width > 600 && width <= 900) {
      this.nameSliceRange = 30;
    } else if (width <= 600) {
      this.nameSliceRange = 20;
    }
  }
}
