import { Component, forwardRef, HostListener, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'wayne-search-section',
  templateUrl: './search-section.component.html',
  styleUrls: ['./search-section.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SearchSectionComponent),    // 这里指向当前组件
    multi: true
  }]
})
export class SearchSectionComponent implements ControlValueAccessor, OnDestroy {
  @ViewChild('input', { static: false }) inputElement: ElementRef;
  _value: string;
  evtList: Array<Function> = Array();
  get value() {
    return this._value;
  }
  set value(value: string) {
    if (value !== this._value) {
      this.updateEmit(value);
    }
  }
  updateEmit = (_: any) => { };
  @HostListener('mouseenter')
  enterEvent() {
    this.input.focus();
  }
  @HostListener('mouseleave')
  leaveEvent() {
    this.input.blur();
  }
  ngOnDestroy() {
    this.evtList.forEach(func => {
      func();
    });
  }
  get input(): HTMLInputElement {
    return this.inputElement.nativeElement;
  }
  writeValue(value: any): void {
    this._value = value;
  }
  registerOnChange(fn: (_: any) => {}): void {
    this.updateEmit = fn;
  }
  registerOnTouched(fn: any): void {
  }
}
