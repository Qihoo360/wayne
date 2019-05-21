import { Component, OnInit, ViewChild } from '@angular/core';
import { ResourceComponent } from 'wayne-component/lib/base/admin-resource/resource';
import { ConfirmationDialogService } from 'wayne-component/lib/confirmation-dialog/confirmation-dialog.service';
import { BreadcrumbService } from 'wayne-component/lib/client/v1/breadcrumb.service';
import { MessageHandlerService } from 'wayne-component';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationTargets } from 'wayne-component/lib/shared.const';
import { AutoscaleService } from 'wayne-component/lib/client/v1/autoscale.service';
import { ListAutoscaleComponent } from './list-autoscale/list-autoscale.component';
import { CreateEditAutoscaleComponent } from './create-edit-autoscale/create-edit-autoscale.component';

@Component({
  selector: 'wayne-autoscale',
  templateUrl: './autoscale.component.html',
  styleUrls: ['./autoscale.component.scss']
})
export class AutoscaleComponent extends ResourceComponent {
  @ViewChild(ListAutoscaleComponent)
  listResourceComponent: ListAutoscaleComponent;
  @ViewChild(CreateEditAutoscaleComponent)
  createEditResourceComponent: CreateEditAutoscaleComponent;

  constructor(public breadcrumbService: BreadcrumbService,
              public route: ActivatedRoute,
              public resourceService: AutoscaleService,
              public messageHandlerService: MessageHandlerService,
              public deletionDialogService: ConfirmationDialogService,
  ) {
    super(breadcrumbService, route, resourceService, messageHandlerService, deletionDialogService, 'HPA', ConfirmationTargets.AUTOSCALE);
  }

}
