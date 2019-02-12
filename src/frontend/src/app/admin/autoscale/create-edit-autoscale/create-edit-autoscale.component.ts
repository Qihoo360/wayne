import { Component } from '@angular/core';
import { CreateEditResourceComponent } from '../../../shared/base/admin-resource/create-edit-resource';
import { AppService } from '../../../shared/client/v1/app.service';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { AutoscaleService } from '../../../shared/client/v1/autoscale.service';
import { Autoscale } from '../../../shared/model/v1/autoscale';

@Component({
  selector: 'wayne-create-edit-autoscale',
  templateUrl: './create-edit-autoscale.component.html',
  styleUrls: ['./create-edit-autoscale.component.scss']
})
export class CreateEditAutoscaleComponent extends CreateEditResourceComponent {

  constructor(public resourceService: AutoscaleService,
              public appService: AppService,
              public aceEditorService: AceEditorService,
              public messageHandlerService: MessageHandlerService) {
    super(resourceService, appService, aceEditorService, messageHandlerService, Autoscale, 'HPA');
  }

}
