import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogOnActionComponent } from './dialog-on-action.component';

describe('DialogOnActionComponent', () => {
  let component: DialogOnActionComponent;
  let fixture: ComponentFixture<DialogOnActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogOnActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogOnActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
