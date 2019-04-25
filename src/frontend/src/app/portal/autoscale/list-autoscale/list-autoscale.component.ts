import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ListResource } from 'wayne-component/lib/base/resource/list-resource';
import { DiffService } from 'wayne-component/lib/diff/diff.service';
import { ConfirmationDialogService } from 'wayne-component/lib/confirmation-dialog/confirmation-dialog.service';
import { MessageHandlerService } from 'wayne-component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'wayne-component/lib/auth/auth.service';
import { ConfirmationTargets } from 'wayne-component/lib/shared.const';
import { TplDetailService } from 'wayne-component/lib/tpl-detail/tpl-detail.service';
import { AceEditorService } from 'wayne-component/lib/ace-editor/ace-editor.service';
import { AutoscaleTplService } from 'wayne-component/lib/client/v1/autoscaletpl.service';
import { AutoscaleService } from 'wayne-component/lib/client/v1/autoscale.service';
import { PublishTplComponent } from '../publish-tpl/publish-tpl.component';
import { StatusComponent } from '../status/status.component';

@Component({
  selector: 'wayne-list-autoscale',
  templateUrl: './list-autoscale.component.html',
  styleUrls: ['./list-autoscale.component.scss']
})
export class ListAutoscaleComponent extends ListResource implements OnInit, OnDestroy {
  @ViewChild(PublishTplComponent)
  publishTemplateComponent: PublishTplComponent;
  @ViewChild(StatusComponent)
  resourceStatusComponent: StatusComponent;

  constructor(public autoscaleTplService: AutoscaleTplService,
              public autoscaleService: AutoscaleService,
              public tplDetailService: TplDetailService,
              public messageHandlerService: MessageHandlerService,
              public route: ActivatedRoute,
              public aceEditorService: AceEditorService,
              public router: Router,
              public diffService: DiffService,
              public authService: AuthService,
              public deletionDialogService: ConfirmationDialogService) {
    super(
      autoscaleTplService,
      autoscaleService,
      tplDetailService,
      messageHandlerService,
      route,
      aceEditorService,
      router,
      diffService,
      authService,
      deletionDialogService
    );
    super.registSubscription(ConfirmationTargets.AUTOSCALE_TPL, 'HPA 模版删除成功！');
    super.registConfirmationTarget(ConfirmationTargets.AUTOSCALE_TPL);
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
