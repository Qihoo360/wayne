import { Component, Input } from '@angular/core';

@Component({
  selector: 'wayne-dropdown-item',
  templateUrl: './dropdown-item.component.html',
  styleUrls: ['./dropdown-item.component.scss']
})

export class DropdownItemComponent {
  @Input() title: string;
}
