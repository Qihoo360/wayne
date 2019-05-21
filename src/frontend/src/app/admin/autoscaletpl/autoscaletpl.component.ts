import { Component, ViewChild } from '@angular/core';
import { ResourceTemplateComponent } from 'wayne-component/lib/base/admin-resource/resource-template';
import { ConfirmationDialogService } from 'wayne-component/lib/confirmation-dialog/confirmation-dialog.service';
import { BreadcrumbService } from 'wayne-component/lib/client/v1/breadcrumb.service';
import { MessageHandlerService } from 'wayne-component';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationTargets } from 'wayne-component/lib/shared.const';
import { AutoscaleTplService } from 'wayne-component/lib/client/v1/autoscaletpl.service';
import { ListAutoscaletplComponent } from './list-autoscaletpl/list-autoscaletpl.component';
import { CreateEditAutoscaletplComponent } from './create-edit-autoscaletpl/create-edit-autoscaletpl.component';

@Component({
  selector: 'wayne-autoscaletpl',
  templateUrl: './autoscaletpl.component.html',
  styleUrls: ['./autoscaletpl.component.scss']
})
export class AutoscaletplComponent extends ResourceTemplateComponent {
  @ViewChild(ListAutoscaletplComponent)
  listResourceTemplateComponent: ListAutoscaletplComponent;
  @ViewChild(CreateEditAutoscaletplComponent)
  createEditResourceTemplateComponent: CreateEditAutoscaletplComponent;

  constructor(
    public breadcrumbService: BreadcrumbService,
    public route: ActivatedRoute,
    public resourceTemplateService: AutoscaleTplService,
    public messageHandlerService: MessageHandlerService,
    public deletionDialogService: ConfirmationDialogService
  ) {
    super(breadcrumbService,
      route, resourceTemplateService, messageHandlerService, deletionDialogService, 'HPA 模板', 'hpa', ConfirmationTargets.AUTOSCALE_TPL);
  }

}
