import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ListResource } from '../../../shared/base/resource/list-resource';
import { DiffService } from '../../../shared/diff/diff.service';
import { ConfirmationDialogService } from '../../../shared/confirmation-dialog/confirmation-dialog.service';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../shared/auth/auth.service';
import { ConfirmationTargets } from '../../../shared/shared.const';
import { TplDetailService } from '../../../shared/tpl-detail/tpl-detail.service';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { AutoscaleTplService } from '../../../shared/client/v1/autoscaletpl.service';
import { AutoscaleService } from '../../../shared/client/v1/autoscale.service';
import { PublishTplComponent } from '../publish-tpl/publish-tpl.component';
import { StatusComponent } from '../status/status.component';

@Component({
  selector: 'wayne-list-autoscale',
  templateUrl: './list-autoscale.component.html',
  styleUrls: ['./list-autoscale.component.scss']
})
export class ListAutoscaleComponent extends ListResource implements OnInit, OnDestroy {
  @ViewChild(PublishTplComponent, { static: false })
  publishTemplateComponent: PublishTplComponent;
  @ViewChild(StatusComponent, { static: false })
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
