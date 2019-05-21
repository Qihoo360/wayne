import { Component, OnInit } from '@angular/core';
import { TrashResourceTemplateComponent } from 'wayne-component/lib/base/admin-resource/trash-resource-template';
import { ConfirmationDialogService } from 'wayne-component/lib/confirmation-dialog/confirmation-dialog.service';
import { MessageHandlerService } from 'wayne-component';
import { AceEditorService } from 'wayne-component/lib/ace-editor/ace-editor.service';
import { ConfirmationTargets } from 'wayne-component/lib/shared.const';
import { AutoscaleTplService } from 'wayne-component/lib/client/v1/autoscaletpl.service';

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
