import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Cluster } from '../../../shared/model/v1/cluster';
import { Page } from '../../../shared/page/page-state';
import { clusterStatus } from 'app/shared/shared.const';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { AceEditorMsg } from '../../../shared/ace-editor/ace-editor';

@Component({
  selector: 'list-cluster',
  templateUrl: 'list-cluster.component.html'
})
export class ListClusterComponent implements OnInit {

  @Input() clusters: Cluster[];

  @Input() page: Page;
  currentPage = 1;
  state: ClrDatagridStateInterface;

  @Output() paginate = new EventEmitter<ClrDatagridStateInterface>();
  @Output() delete = new EventEmitter<Cluster>();
  @Output() edit = new EventEmitter<Cluster>();


  constructor(private router: Router,
              private aceEditorService: AceEditorService) {
  }

  ngOnInit(): void {
  }

  pageSizeChange(pageSize: number) {
    this.state.page.to = pageSize - 1;
    this.state.page.size = pageSize;
    this.currentPage = 1;
    this.paginate.emit(this.state);
  }

  refresh(state: ClrDatagridStateInterface) {
    this.state = state;
    this.paginate.emit(state);
  }

  getClusterStatus(state: number) {
    return clusterStatus[state];
  }

  deleteCluster(cluster: Cluster) {
    this.delete.emit(cluster);
  }

  editCluster(cluster: Cluster) {
    this.edit.emit(cluster);
  }

  detailMetaDataTpl(tpl: string) {
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(tpl, false, '元数据查看'));
  }

}
