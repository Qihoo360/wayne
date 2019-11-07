import { Component, EventEmitter, forwardRef, Input, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'wayne-input',
  templateUrl: './input.component.html',
  styleUrls: ['input.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputComponent),    // 这里指向当前组件
    multi: true
  }]
})

export class InputComponent implements ControlValueAccessor {
  @ViewChild('input', { static: false }) inputElement;
  @Input() placeholder = '';
  @Input() type = 'text';

  @Input()
  set search(value) {
    if (value !== undefined) {
      this.showSearch = true;
    }
  }

  @Input() cursor = 'auto';

  @Input()
  set readonly(value: any) {
    this.readOnly = value ? true : false;
    this.cursor = this.readonly ? 'pointer' : this.cursor;
  }

  @Output() input = new EventEmitter<any>();
  @Output() change = new EventEmitter<any>();

  value: string;
  readOnly = false;
  showSearch = false;
  focusState = false;
  updateEmit = (_: any) => {
  }

  writeValue(value: any): void {
    if (value !== this.value) {
      this.value = value;
    }
  }

  inputEvent(event: any) {
    this.updateEmit(event.target.value);
  }

  changeEvent(event: any) {
    this.change.emit(event);
  }

  registerOnChange(fn: (_: any) => {}): void {
    this.updateEmit = fn;
  }

  registerOnTouched(fn: any): void {
  }
}
