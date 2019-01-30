import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BreadcrumbService } from '../../../shared/client/v1/breadcrumb.service';
import { Router } from '@angular/router';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Namespace } from '../../../shared/model/v1/namespace';
import { Page } from '../../../shared/page/page-state';

@Component({
  selector: 'list-namespace',
  templateUrl: 'list-namespace.component.html'
})
export class ListNamespaceComponent implements OnInit {

  @Input() namespaces: Namespace[];

  @Input() page: Page;
  currentPage = 1;
  state: ClrDatagridStateInterface;

  @Output() paginate = new EventEmitter<ClrDatagridStateInterface>();
  @Output() delete = new EventEmitter<Namespace>();
  @Output() edit = new EventEmitter<Namespace>();

  constructor(
    private breadcrumbService: BreadcrumbService,
    private router: Router
  ) {
    breadcrumbService.hideRoute('/admin/namespace/app');
    breadcrumbService.hideRoute('/admin/namespace/user');
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

  deleteNamespace(ns: Namespace) {
    this.delete.emit(ns);
  }

  editNamespace(ns: Namespace) {
    this.edit.emit(ns);
  }

  goToLink(ns: Namespace, gate: string) {
    let linkUrl = new Array();
    switch (gate) {
      case 'app':
        this.breadcrumbService.addFriendlyNameForRouteRegex('/admin/namespace/app/[0-9]*', '[' + ns.name + ']项目列表');
        linkUrl = ['admin', 'namespace', 'app', ns.id];
        break;
      case 'user':
        this.breadcrumbService.addFriendlyNameForRouteRegex('/admin/namespace/user/[0-9]*', '[' + ns.name + ']用户列表');
        linkUrl = ['admin', 'namespace', 'user', ns.id];
        break;
      default:
        break;
    }
    this.router.navigate(linkUrl);
  }
}
