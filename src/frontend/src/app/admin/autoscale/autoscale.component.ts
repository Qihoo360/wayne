import { Component, OnInit, ViewChild } from '@angular/core';
import { ResourceComponent } from '../../shared/base/admin-resource/resource';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { BreadcrumbService } from '../../shared/client/v1/breadcrumb.service';
import { MessageHandlerService } from '../../shared/message-handler/message-handler.service';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationTargets } from '../../shared/shared.const';
import { AutoscaleService } from '../../shared/client/v1/autoscale.service';
import { ListAutoscaleComponent } from './list-autoscale/list-autoscale.component';
import { CreateEditAutoscaleComponent } from './create-edit-autoscale/create-edit-autoscale.component';

@Component({
  selector: 'wayne-autoscale',
  templateUrl: './autoscale.component.html',
  styleUrls: ['./autoscale.component.scss']
})
export class AutoscaleComponent extends ResourceComponent {
  @ViewChild(ListAutoscaleComponent, { static: false })
  listResourceComponent: ListAutoscaleComponent;
  @ViewChild(CreateEditAutoscaleComponent, { static: false })
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
