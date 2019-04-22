import { Component, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'wayne-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss']
})

export class OptionComponent {

  @Input() value;

  constructor(private el: ElementRef) {
  }

}
