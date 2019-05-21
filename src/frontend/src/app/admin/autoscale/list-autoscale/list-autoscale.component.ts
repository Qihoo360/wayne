import { Component } from '@angular/core';
import { ListResourceComponent } from 'wayne-component/lib/base/admin-resource/list-resource';
import { BreadcrumbService } from 'wayne-component/lib/client/v1/breadcrumb.service';
import { AceEditorService } from 'wayne-component/lib/ace-editor/ace-editor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'wayne-list-autoscale',
  templateUrl: './list-autoscale.component.html',
  styleUrls: ['./list-autoscale.component.scss']
})
export class ListAutoscaleComponent extends ListResourceComponent {

  constructor(public breadcrumbService: BreadcrumbService,
              public router: Router,
              public aceEditorService: AceEditorService,
              ) {
    super(breadcrumbService, router, aceEditorService, 'hpa');
  }

}
