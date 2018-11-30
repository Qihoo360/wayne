import { Component, Input } from '@angular/core';

@Component({
  selector: 'wayne-card',
  templateUrl: 'card.component.html',
  styleUrls: ['./card.component.scss']
})

export class CardComponent {

  cardTitle: string;

  @Input()
  set header(value: string) {
    if (value) {
      this.cardTitle = value;
    }
  }

}
