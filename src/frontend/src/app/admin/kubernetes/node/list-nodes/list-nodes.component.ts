import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/combineLatest';
import {
  CriComparator,
  KernelComparator,
  LabelFilter,
  NameComparator,
  NameFilter,
  OsImageComparator,
  ReadyComparator,
  SchedulerComparator
} from './inventory';
import { ClrDatagridSortOrder } from '@clr/angular';
import { Node } from 'app/shared/model/v1/kubernetes/node-list';
import { StorageService } from '../../../../shared/client/v1/storage.service';
import { CreateEditLabelComponent } from '../create-edit-label/create-edit-label.component';
import { CreateEditTaintComponent } from '../create-edit-taint/create-edit-taint.component';

@Component({
  selector: 'list-nodes',
  templateUrl: 'list-nodes.component.html'
})

export class ListNodesComponent implements OnInit {

  @ViewChild(CreateEditLabelComponent, {static: false})
  editLabelModal: CreateEditLabelComponent;

  @ViewChild(CreateEditTaintComponent, {static: false})
  editTaintModal: CreateEditTaintComponent;

  @Input() nodes: Node[];
  @Input() cluster: string;
  @Input() showState: object;
  sortOrder: ClrDatagridSortOrder = ClrDatagridSortOrder.UNSORTED;
  sorted = false;
  currentPage = 1;
  _pageSize = 10;
  nameComparator = new NameComparator();
  readyComparator = new ReadyComparator();
  osImageComparator = new OsImageComparator();
  kernelComparator = new KernelComparator();
  criComparator = new CriComparator();
  schedulerComparator = new SchedulerComparator();
  nameFilter = new NameFilter();
  labelFilter = new LabelFilter();
  @Output() delete = new EventEmitter<Node>();
  @Output() edit = new EventEmitter<Node>();
  @Output() refresh = new EventEmitter<boolean>();
  pageSizes: number[] = new Array(10, 20, 50);

  constructor(private storage: StorageService) {

  }

  get pageSize() {
    return this._pageSize;
  }

  set pageSize(page: number) {
    if (page && this.pageSizes.indexOf(page) > -1) {
      this.storage.save('pagesize', page);
    }
    if (page !== this._pageSize) {
      this._pageSize = Number(page);
    }
  }

  ngOnInit(): void {
    this._pageSize = parseInt(this.storage.get('pagesize'), 10) || 10;
  }

  retrieve() {
    this.refresh.emit(true);
  }

  editNode(node: Node) {
    this.edit.emit(node);
  }

  editLabel(node: Node) {
    this.editLabelModal.openModal(node);
  }

  editTaint(node: Node) {
    this.editTaintModal.openModal(node);
  }

  deleteNode(node: Node) {
    this.delete.emit(node);
  }

}


