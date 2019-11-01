import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { TaintMetaData } from 'app/shared/model/v1/kubernetes/node-list';
import { ClusterService } from 'app/shared/client/v1/cluster.service';
import { Node } from 'app/shared/model/v1/kubernetes/node-list';
import { NgForm } from '@angular/forms';
import { Observable, ObservableInput, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { MessageHandlerService } from 'app/shared/message-handler/message-handler.service';

@Component({
  selector: 'create-edit-taint',
  templateUrl: './create-edit-taint.component.html',
  styleUrls: ['./create-edit-taint.component.scss']
})
export class CreateEditTaintComponent implements OnInit {
  createTaintOpened = false;
  name = '';
  taintList: TaintMetaData[] = [];
  addList: TaintMetaData[] = [];
  deleteList: TaintMetaData[] = [];
  nodeName: string;
  taintForm: NgForm;
  @ViewChild('taintForm', { static: true })
  currentForm: NgForm;

  @Output() refresh = new EventEmitter<any>();

  constructor(
    private clusterService: ClusterService,
    private messageHandlerService: MessageHandlerService,
  ) { }
  formatLabel(taintArray: TaintMetaData[] | undefined): TaintMetaData[] {
    return taintArray ? taintArray.slice(0) : [];
  }

  ngOnInit() {
  }

  addTaint() {
    this.addList.push(new TaintMetaData);
  }

  removeTaint(i: number) {
    this.addList.splice(i, 1);
  }

  deleteTaint(i: number) {
    this.deleteList.push(this.taintList.splice(i, 1)[0] as TaintMetaData);
  }

  initData(node: Node) {
    this.nodeName = node.name;
    this.taintList = this.formatLabel(node.spec.taints);
    this.addList = [];
    this.deleteList = [];
  }

  openModal(node: Node) {
    this.createTaintOpened = true;
    this.initData(node);
  }

  onCancel() {
    this.createTaintOpened = false;
  }

  deleteEvent() {
    this.clusterService.deleteLabels(this.nodeName, this.clusterService.cluster, {
      Labels: this.deleteList
    }).subscribe(
      response => this.handleSuccess(),
      error => this.handleError(error)
    );
  }

  handleSuccess() {
    this.messageHandlerService.showSuccess(`${this.nodeName} taint 修改成功`);
    this.createTaintOpened = false;
    this.refresh.emit();
  }

  handleError(error) {
    this.messageHandlerService.error(`${this.nodeName} taint 修改失败 ${error}`);
  }

  onSubmit() {
    const observables: ObservableInput<any>[] = [];
    const result: any[] = [];
    if (this.addList.length) {
      for (let i = 0; i < this.addList.length; i++) {
        observables.push(this.clusterService.addTaint(this.nodeName, this.clusterService.cluster, this.addList[i]));
      }
    }
    if (this.deleteList.length) {
      for (let i = 0; i < this.deleteList.length; i++) {
        observables.push(this.clusterService.deleteTaint(this.nodeName, this.clusterService.cluster, this.deleteList[i]));
      }
    }
    of(...observables).pipe(
      concatMap((val, index) => val)
    )
    .subscribe(
      res => {
        result.push(res);
        if (result.length === [...this.addList, ...this.deleteList].length) {
          this.handleSuccess();
        }
      },
      error => this.handleError(error)
    );
  }

  public get isValid() {
    return this.currentForm
    && this.currentForm.valid;
  }

  trackByFn(index: number) {
    return index;
  }

}
