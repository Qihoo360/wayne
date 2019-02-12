import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ClrDatagridStateInterface } from '@clr/angular';
import { DeploymentTpl } from '../../../shared/model/v1/deploymenttpl';
import { Page } from '../../../shared/page/page-state';

@Component({
  selector: 'list-deploymenttpl',
  templateUrl: 'list-deploymenttpl.component.html'
})
export class ListDeploymentTplComponent implements OnInit {

  @Input() deploymentTpls: DeploymentTpl[];

  @Input() page: Page;
  currentPage = 1;
  state: ClrDatagridStateInterface;

  @Output() paginate = new EventEmitter<ClrDatagridStateInterface>();
  @Output() delete = new EventEmitter<DeploymentTpl>();
  @Output() edit = new EventEmitter<DeploymentTpl>();


  constructor(private router: Router) {
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

  deleteDeploymentTpl(deploymentTpl: DeploymentTpl) {
    this.delete.emit(deploymentTpl);
  }

  editDeploymentTpl(deploymentTpl: DeploymentTpl) {
    this.edit.emit(deploymentTpl);
  }
}
