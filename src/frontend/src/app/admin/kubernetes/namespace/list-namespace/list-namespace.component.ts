import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NamespaceList } from '../../../../shared/model/v1/namespace-list';


@Component({
  selector: 'wayne-list-namespace',
  templateUrl: './list-namespace.component.html',
  styleUrls: ['./list-namespace.component.scss']
})

export class ListNamespaceComponent implements OnInit, OnDestroy {
  @Input() resources: NamespaceList[];
  @Input() showState: object;

  @Output() detail = new EventEmitter<NamespaceList>();

  constructor() {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  onDetailEvent(obj: any) {
    this.detail.emit(obj);
  }
}
