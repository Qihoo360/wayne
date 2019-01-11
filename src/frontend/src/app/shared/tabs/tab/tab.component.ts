import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { TabDragService } from '../../client/v1/tab-drag.service';

@Component({
  selector: 'wayne-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
})
export class TabComponent implements OnInit {
  descInfo: string;

  constructor(private el: ElementRef, private dragService: TabDragService) {
    el.nativeElement.setAttribute('draggable', 'true');
  }

  @Input() active: boolean;

  // 这里因为标签较大，所以tip需要做向下调整
  @Input()
  set description(value: string) {
    if (value) {
      this.descInfo = value;
    }
  }

  @Input() id: number;
  @Output() orderChange = new EventEmitter();



  @HostListener('dragstart', ['$event'])
  startEvent(event) {
    event.dataTransfer.setData('text/plain', null);
    event.target.childNodes[0].style.borderBottom = null;
  }

  @HostListener('dragend')

  ngOnInit() {
  }

}
