import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoragePageTableComponent } from './storage-page-table.component';

describe('StoragePageTableComponent', () => {
  let component: StoragePageTableComponent;
  let fixture: ComponentFixture<StoragePageTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoragePageTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoragePageTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
