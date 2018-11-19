import {Component, OnInit} from '@angular/core';
import {BreadcrumbService} from '../shared/client/v1/breadcrumb.service';

@Component({
  selector: 'wayne-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  constructor(private breadcrumbService: BreadcrumbService) {
    breadcrumbService.addFriendlyNameForRoute('/admin', '后台首页');
    breadcrumbService.hideRoute('/admin/system');
  }

  ngOnInit() {
  }
}
