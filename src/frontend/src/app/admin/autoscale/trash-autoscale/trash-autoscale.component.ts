import { Component } from '@angular/core';
import { TrashResourceComponent } from '../../../shared/base/admin-resource/trash-resource';
import { ConfirmationDialogService } from '../../../shared/confirmation-dialog/confirmation-dialog.service';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { ConfirmationTargets } from '../../../shared/shared.const';
import { AutoscaleService } from '../../../shared/client/v1/autoscale.service';

@Component({
  selector: 'wayne-trash-autoscale',
  templateUrl: './trash-autoscale.component.html',
  styleUrls: ['./trash-autoscale.component.scss']
})
export class TrashAutoscaleComponent extends TrashResourceComponent {

  constructor(public resourceService: AutoscaleService,
              public messageHandlerService: MessageHandlerService,
              public deletionDialogService: ConfirmationDialogService,
              public aceEditorService: AceEditorService) {
    super( resourceService, messageHandlerService, deletionDialogService, aceEditorService, 'hpa', ConfirmationTargets.AUTOSCALE );

  }
}
