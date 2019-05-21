import { Component } from '@angular/core';
import { TrashResourceComponent } from 'wayne-component/lib/base/admin-resource/trash-resource';
import { ConfirmationDialogService } from 'wayne-component/lib/confirmation-dialog/confirmation-dialog.service';
import { MessageHandlerService } from 'wayne-component';
import { AceEditorService } from 'wayne-component/lib/ace-editor/ace-editor.service';
import { ConfirmationTargets } from 'wayne-component/lib/shared.const';
import { AutoscaleService } from 'wayne-component/lib/client/v1/autoscale.service';

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
