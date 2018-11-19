import {Component, OnInit, forwardRef, Input, Output, EventEmitter, Renderer2, ViewChild, ElementRef, TemplateRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'wayne-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SwitchComponent),
    multi: true
  }]
})
/**
 * 
 */
export class SwitchComponent implements OnInit, ControlValueAccessor {
  choosed: any;
  @Input('key1') span1Text: string;
  @Input('key2') span2Text: string;
  @Input('value1') span1Value: any;
  @Input('value2') span2Value: any;
  // model -> view function 
  @ViewChild('span1') span1: ElementRef;
  @ViewChild('span2') span2: ElementRef;
  @ViewChild('button') button: ElementRef;
  @Output() change = new EventEmitter<boolean>();
  get span1Width(): string{
    return this.span1.nativeElement.clientWidth;
  }
  get buttonWidth(): string{
    if (this.choosed === this.span1Value) {
      this._render.setStyle(this.button.nativeElement, 'left', `0px`);
      return this.span1Width + 'px';
    } else if (this.choosed === this.span2Value) {
      this._render.setStyle(this.button.nativeElement, 'left', `${this.span1Width}px`);
      return this.span2Width + 'px';
    } else {
      return 0 + 'px';
    }
  }

  get span2Width(): string{
    return this.span2.nativeElement.clientWidth;
  }
  updateEmit = (_: any) => {};

  constructor (private _render: Renderer2) {}

  ngOnInit() {}

  changeItem () {
    this.choosed = this.choosed === this.span1Value ? this.span2Value : this.span1Value;
    this.updateEmit(this.choosed);
    this.change.emit(this.choosed);
  }

  writeValue(value: any) :void {
    if (value !== this.choosed) {
      this.choosed = value;
    }
  }

  registerOnChange(fn: (_: any) => {}): void {
    this.updateEmit = fn;
  }
  // this is invalid so given an empty result
  registerOnTouched(fn: any): void {}
}