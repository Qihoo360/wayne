import { Component, Input } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'wayne-collapse',
  templateUrl: './collapse.component.html',
  styleUrls: ['./collapse.component.scss'],
  animations: [
    trigger('showContent', [
      state('show', style({ height: '*' })),
      transition('* => void', [
        style({ height: '*' }),
        animate('100ms 0s ease-in-out', style({ height: 0 }))
      ]),
      transition('void => *', [
        style({ height: 0 }),
        animate('150ms 0s ease-in-out', style({ height: '*' }))
      ])
    ])
  ]
})
export class CollapseComponent {
  show = true;
  @Input() disabled: boolean;
}
