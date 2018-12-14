import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NodeClient } from '../../../../shared/client/v1/kubernetes/node';
import { State } from '@clr/angular';
import { Page } from '../../../../shared/page/page-state';
import { NamespaceList } from '../../../../shared/model/v1/namespace-list';


@Component({
  selector: 'wayne-list-namespace',
  templateUrl: './list-namespace.component.html',
  styleUrls: ['./list-namespace.component.scss']
})

export class ListNamespaceComponent implements OnInit, OnDestroy {
  @Input() resources: NamespaceList[];
  @Input() page: Page;
  @Input() showState: object;
  currentPage = 1;
  state: State;

  @Output() paginate = new EventEmitter<State>();
  @Output() detail = new EventEmitter<NamespaceList>();
  @Output() migration = new EventEmitter<NamespaceList>();

  constructor() {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  refresh(state: State) {
    this.state = state;
    this.paginate.emit(state);
  }

  pageSizeChange(pageSize: number) {
    this.state.page.to = pageSize - 1;
    this.state.page.size = pageSize;
    this.currentPage = 1;
    this.paginate.emit(this.state);
  }
}
