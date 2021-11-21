import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RequestTypeEnum, URL_REGEXP } from '../../../interfaces/constant';
import { RequestForm } from '../../../interfaces/interfaces.vm';
import { UiStateService } from '../../../services/ui-state.service';

@Component({
  selector: 'app-work-request-block',
  templateUrl: './request-block.component.html',
  styleUrls: ['./request-block.component.scss']
})
export class RequestBlockComponent implements OnInit, OnChanges {
  @Input() pathFormValue: RequestForm;
  @Output() requestFormStatus: EventEmitter<boolean> = new EventEmitter<boolean>();
  requestForm: FormGroup;
  type = RequestTypeEnum;

  get formHeaders(): FormArray {
    return this.requestForm.controls.headers as FormArray;
  }

  constructor(private readonly fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.pathFormValue.firstChange) {
      const {pathFormValue: {currentValue}} = changes;
      this.initForm();
      currentValue.headers.forEach(() => this.addHeader());
      this.requestForm.patchValue(currentValue);
      this.getIsInvalidOnChangeInForm();
    }
  }

  initForm(): void {
    this.requestForm = this.fb.group({
      type: [RequestTypeEnum.GET],
      url: ['http://', [Validators.required, Validators.pattern(URL_REGEXP)]],
      body: [''],
      headers: this.fb.array([]),
    });
  }

  addHeader(): void {
    this.formHeaders.push(
      this.fb.group({
        key: ['', Validators.required],
        value: ['', Validators.required],
      }),
    );
    this.getIsInvalidOnChangeInForm();
  }

  removeHeader(i: number): void {
    this.formHeaders.removeAt(i);
    this.getIsInvalidOnChangeInForm();
  }

  getIsInvalidOnChangeInForm(): void {
    this.requestFormStatus.next(this.requestForm.invalid);
  }
}
