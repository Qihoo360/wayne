import { Component, ViewChild } from '@angular/core';
import { ResourceTemplateComponent } from '../../shared/base/admin-resource/resource-template';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { BreadcrumbService } from '../../shared/client/v1/breadcrumb.service';
import { MessageHandlerService } from '../../shared/message-handler/message-handler.service';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationTargets } from '../../shared/shared.const';
import { AutoscaleTplService } from '../../shared/client/v1/autoscaletpl.service';
import { ListAutoscaletplComponent } from './list-autoscaletpl/list-autoscaletpl.component';
import { CreateEditAutoscaletplComponent } from './create-edit-autoscaletpl/create-edit-autoscaletpl.component';

@Component({
  selector: 'wayne-autoscaletpl',
  templateUrl: './autoscaletpl.component.html',
  styleUrls: ['./autoscaletpl.component.scss']
})
export class AutoscaletplComponent extends ResourceTemplateComponent {
  @ViewChild(ListAutoscaletplComponent, { static: false })
  listResourceTemplateComponent: ListAutoscaletplComponent;
  @ViewChild(CreateEditAutoscaletplComponent, { static: false })
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
