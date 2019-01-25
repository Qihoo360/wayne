import { Component } from '@angular/core';
import { CreateEditResourceTemplateComponent } from '../../../shared/base/admin-resource/create-edit-resource-template';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { AutoscaleTplService } from '../../../shared/client/v1/autoscaletpl.service';
import { AutoscaleService } from '../../../shared/client/v1/autoscale.service';
import { defaultAutoscale } from '../../../shared/default-models/autoscale.const';
import { AutoscaleTpl } from '../../../shared/model/v1/autoscaletpl';

@Component({
  selector: 'wayne-create-edit-autoscaletpl',
  templateUrl: './create-edit-autoscaletpl.component.html',
  styleUrls: ['./create-edit-autoscaletpl.component.scss']
})
export class CreateEditAutoscaletplComponent extends CreateEditResourceTemplateComponent {

  constructor(public templateService: AutoscaleTplService,
              public resourceService: AutoscaleService,
              public messageHandlerService: MessageHandlerService,
              public aceEditorService: AceEditorService
              ) {
    super(templateService,
      resourceService,
      messageHandlerService,
      aceEditorService, AutoscaleTpl,
      'hpa', defaultAutoscale,
    );
  }
}
