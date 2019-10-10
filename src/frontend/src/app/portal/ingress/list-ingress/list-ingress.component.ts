import { OnInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { IngressService } from '../../../shared/client/v1/ingress.service';
import { IngressTplService } from '../../../shared/client/v1/ingresstpl.service';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../shared/auth/auth.service';
import { ConfirmationDialogService } from '../../../shared/confirmation-dialog/confirmation-dialog.service';
import { PublishIngressTplComponent } from '../publish-tpl/publish-tpl.component';
import { IngressStatusComponent } from '../status/status.component';
import { ConfirmationTargets } from '../../../shared/shared.const';
import { TplDetailService } from '../../../shared/tpl-detail/tpl-detail.service';
import { ListResource } from '../../../shared/base/resource/list-resource';
import { DiffService } from '../../../shared/diff/diff.service';

@Component({
  selector: 'list-ingress',
  templateUrl: 'list-ingress.component.html',
  styleUrls: ['list-ingress.scss']
})
export class ListIngressComponent extends ListResource implements OnInit, OnDestroy {
  @ViewChild(PublishIngressTplComponent, { static: false })
  publishTemplateComponent: PublishIngressTplComponent;
  @ViewChild(IngressStatusComponent, { static: false })
  resourceStatusComponent: IngressStatusComponent;

  constructor(public ingressTplService: IngressTplService,
              public ingressService: IngressService,
              public tplDetailService: TplDetailService,
              public messageHandlerService: MessageHandlerService,
              public route: ActivatedRoute,
              public aceEditorService: AceEditorService,
              public router: Router,
              public diffService: DiffService,
              public authService: AuthService,
              public deletionDialogService: ConfirmationDialogService) {
    super(
      ingressTplService,
      ingressService,
      tplDetailService,
      messageHandlerService,
      route,
      aceEditorService,
      router,
      diffService,
      authService,
      deletionDialogService
    );
    super.registSubscription(ConfirmationTargets.INGRESS_TPL, 'Ingress 模版删除成功！');
    super.registConfirmationTarget(ConfirmationTargets.INGRESS_TPL);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
