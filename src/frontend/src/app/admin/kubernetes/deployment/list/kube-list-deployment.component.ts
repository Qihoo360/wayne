import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Page } from '../../../../shared/page/page-state';
import { BreadcrumbService } from '../../../../shared/client/v1/breadcrumb.service';
import { DeploymentList } from '../../../../shared/model/v1/deployment-list';
import { TplDetailService } from '../../../../shared/tpl-detail/tpl-detail.service';

@Component({
  selector: 'kube-list-deployment',
  templateUrl: 'kube-list-deployment.component.html'
})
export class KubeListDeploymentComponent implements OnInit {

  @Input() deployments: DeploymentList[];
  @Input() page: Page;
  @Input() showState: object;
  currentPage = 1;
  state: ClrDatagridStateInterface;

  @Output() paginate = new EventEmitter<ClrDatagridStateInterface>();
  @Output() detail = new EventEmitter<DeploymentList>();
  @Output() migration = new EventEmitter<DeploymentList>();

  constructor(
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private tplDetailService: TplDetailService) {
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

  versionDetail(version: string) {
    this.tplDetailService.openModal(version, '版本');
  }

  detailDeployment(obj: DeploymentList) {
    this.detail.emit(obj);
  }

  migrationDeployment(obj: DeploymentList) {
    this.migration.emit(obj);
  }
}
