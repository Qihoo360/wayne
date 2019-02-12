import { Component, OnInit } from '@angular/core';
import { TrashResourceTemplateComponent } from '../../../shared/base/admin-resource/trash-resource-template';
import { ConfirmationDialogService } from '../../../shared/confirmation-dialog/confirmation-dialog.service';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { ConfirmationTargets } from '../../../shared/shared.const';
import { AutoscaleTplService } from '../../../shared/client/v1/autoscaletpl.service';

@Component({
  selector: 'wayne-trash-autoscaletpl',
  templateUrl: './trash-autoscaletpl.component.html',
  styleUrls: ['./trash-autoscaletpl.component.scss']
})
export class TrashAutoscaletplComponent extends TrashResourceTemplateComponent {

  constructor(public resourceTemplateService: AutoscaleTplService,
              public messageHandlerService: MessageHandlerService,
              public deletionDialogService: ConfirmationDialogService,
              public aceEditorService: AceEditorService) {
    super(resourceTemplateService,
      messageHandlerService,
      deletionDialogService,
      aceEditorService,
      'HPA 模板',
      'hpa',
      ConfirmationTargets.AUTOSCALE_TPL,
      );

  }

}
