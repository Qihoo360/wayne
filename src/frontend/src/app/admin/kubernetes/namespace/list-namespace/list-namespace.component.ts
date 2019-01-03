import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NamespaceList } from '../../../../shared/model/v1/namespace-list';
import { KubernetesListResource } from '../../../../shared/base/kubernetes/kubernetes-list-resource';


@Component({
  selector: 'wayne-list-namespace',
  templateUrl: './list-namespace.component.html',
  styleUrls: ['./list-namespace.component.scss']
})

export class ListNamespaceComponent extends KubernetesListResource implements OnInit, OnDestroy {
  @Input() resources: NamespaceList[];
  @Input() showState: object;

  @Output() detail = new EventEmitter<NamespaceList>();

  constructor() {
    super();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }


}
