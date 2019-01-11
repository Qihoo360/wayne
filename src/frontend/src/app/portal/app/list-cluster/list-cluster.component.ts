import { Component, Input } from '@angular/core';
import { Cluster } from './cluster';

@Component({
  selector: 'list-cluster',
  templateUrl: './list-cluster.component.html',
  styleUrls: ['./list-cluster.component.scss']
})

export class ListClusterComponent {

  @Input() resources: Cluster[] = [];

  constructor() {
  }

  modalOpened = false;

  open() {
    this.modalOpened = true;
  }
}
