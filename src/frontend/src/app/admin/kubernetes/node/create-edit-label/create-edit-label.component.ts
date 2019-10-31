import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { LabelMetaData } from 'app/shared/model/v1/kubernetes/node-list';
import { ClusterService } from 'app/shared/client/v1/cluster.service';
import { Node } from 'app/shared/model/v1/kubernetes/node-list';
import { NgForm } from '@angular/forms';
import { MessageHandlerService } from 'app/shared/message-handler/message-handler.service';

@Component({
  selector: 'create-edit-label',
  templateUrl: './create-edit-label.component.html',
  styleUrls: ['./create-edit-label.component.scss']
})
export class CreateEditLabelComponent implements OnInit {
  createLabelOpened = false;
  labelObj = {};
  name = '';
  labelList: LabelMetaData[] = [];
  addList: LabelMetaData[] = [];
  deleteList: LabelMetaData[] = [];
  nodeName: string;
  labelForm: NgForm;
  @ViewChild('labelForm', { static: true })
  currentForm: NgForm;

  @Output() refresh = new EventEmitter<any>();

  constructor(
    private clusterService: ClusterService,
    private messageHandlerService: MessageHandlerService,
  ) { }
  formatLabel(labelObj: Object): LabelMetaData[] {
    return Object.keys(labelObj).map(key => {
      return {
        key,
        value: labelObj[key]
      };
    });
  }

  ngOnInit() {
  }

  addLabel() {
    this.addList.push(new LabelMetaData);
  }

  removeLabel(i: number) {
    this.addList.splice(i, 1);
  }

  deleteLabel(i: number) {
    this.deleteList.push(this.labelList.splice(i, 1)[0] as LabelMetaData);
  }

  initData(node: Node) {
    this.nodeName = node.name;
    this.labelList = this.formatLabel(node.labels);
    this.addList = [];
    this.deleteList = [];
  }

  openModal(node: Node) {
    this.createLabelOpened = true;
    this.initData(node);
  }

  onCancel() {
    this.createLabelOpened = false;
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
    this.messageHandlerService.showSuccess(`${this.nodeName} label 修改成功`);
    this.createLabelOpened = false;
    this.refresh.emit();
  }

  handleError(error) {
    this.messageHandlerService.error(`${this.nodeName} label 修改失败 ${error}`);
  }

  onSubmit() {
    if (this.addList.length) {
      this.clusterService.addLabels(this.nodeName, this.clusterService.cluster, {
        Labels: this.addList
      }).subscribe(
        res => {
          if (this.deleteList.length) {
            this.deleteEvent();
          } else {
            this.handleSuccess();
          }
        }
      );
    } else if (this.deleteList.length) {
      this.deleteEvent();
    }
  }

  public get isValid() {
    return this.currentForm
    && this.currentForm.valid;
  }

  trackByFn(index: number) {
    return index;
  }
}
