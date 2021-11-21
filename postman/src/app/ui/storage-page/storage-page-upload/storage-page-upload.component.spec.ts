import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoragePageUploadComponent } from './storage-page-upload.component';

describe('StoragePageUploadComponent', () => {
  let component: StoragePageUploadComponent;
  let fixture: ComponentFixture<StoragePageUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoragePageUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoragePageUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
