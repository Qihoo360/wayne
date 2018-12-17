import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NodeClient } from '../../../../shared/client/v1/kubernetes/node';
import { State } from '@clr/angular';
import { Page } from '../../../../shared/page/page-state';
import { NamespaceList } from '../../../../shared/model/v1/namespace-list';
import {DeploymentList} from '../../../../shared/model/v1/deployment-list';


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
