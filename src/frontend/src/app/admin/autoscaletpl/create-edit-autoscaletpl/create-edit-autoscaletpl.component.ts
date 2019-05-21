import { Component } from '@angular/core';
import { CreateEditResourceTemplateComponent } from 'wayne-component/lib/base/admin-resource/create-edit-resource-template';
import { MessageHandlerService } from 'wayne-component';
import { AceEditorService } from 'wayne-component/lib/ace-editor/ace-editor.service';
import { AutoscaleTplService } from 'wayne-component/lib/client/v1/autoscaletpl.service';
import { AutoscaleService } from 'wayne-component/lib/client/v1/autoscale.service';
import { defaultAutoscale } from 'wayne-component/lib/default-models/autoscale.const';
import { AutoscaleTpl } from 'wayne-component/lib/model/v1/autoscaletpl';

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
