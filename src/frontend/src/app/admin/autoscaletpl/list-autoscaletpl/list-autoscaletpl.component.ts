import { Component } from '@angular/core';
import { BreadcrumbService } from '../../../shared/client/v1/breadcrumb.service';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { Router } from '@angular/router';
import { ListResourceTemplateComponent } from '../../../shared/base/admin-resource/list-resource-template';

@Component({
  selector: 'wayne-list-autoscaletpl',
  templateUrl: './list-autoscaletpl.component.html',
  styleUrls: ['./list-autoscaletpl.component.scss']
})
export class ListAutoscaletplComponent extends ListResourceTemplateComponent {

  constructor(public router: Router) {
    super( router);
  }

}
