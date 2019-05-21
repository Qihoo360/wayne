import { Component } from '@angular/core';
import { CreateEditResourceComponent } from 'wayne-component/lib/base/admin-resource/create-edit-resource';
import { AppService } from 'wayne-component/lib/client/v1/app.service';
import { MessageHandlerService } from 'wayne-component';
import { AceEditorService } from 'wayne-component/lib/ace-editor/ace-editor.service';
import { AutoscaleService } from 'wayne-component/lib/client/v1/autoscale.service';
import { Autoscale } from 'wayne-component/lib/model/v1/autoscale';

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
