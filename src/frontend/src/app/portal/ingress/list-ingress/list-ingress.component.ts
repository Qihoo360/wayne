import { OnInit, Component, OnDestroy, AfterContentInit, ViewChild, ElementRef, Output, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { State } from '@clr/angular';
import { Ingress } from '../../../shared/model/v1/ingress';
import { IngressTpl } from '../../../shared/model/v1/ingresstpl';
import { Page } from '../../../shared/page/page-state';
import { EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { IngressService } from '../../../shared/client/v1/ingress.service';
import { IngressTplService } from '../../../shared/client/v1/ingresstpl.service';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../shared/auth/auth.service';
import { ConfirmationDialogService } from '../../../shared/confirmation-dialog/confirmation-dialog.service';
import { ConfirmationMessage } from '../../../shared/confirmation-dialog/confirmation-message';
import { AceEditorMsg } from '../../../shared/ace-editor/ace-editor';
import { PublishStatus } from '../../../shared/model/v1/publish-status';
import { PublishIngressTplComponent } from '../publish-tpl/publish-tpl.component';
import { IngressStatusComponent } from '../status/status.component';
import {
  ConfirmationButtons,
  ConfirmationState,
  ConfirmationTargets,
  ResourcesActionType,
  TemplateState
} from '../../../shared/shared.const';
import { TplDetailService } from '../../../shared/tpl-detail/tpl-detail.service';
import { ListResource} from '../../../../packages/kubernetes/list-resource';


@Component({
  selector: 'list-ingress',
  templateUrl: 'list-ingress.component.html',
  styleUrls: ['list-ingress.scss']
})
export class ListIngressComponent extends ListResource implements OnInit, OnDestroy {
  @ViewChild(PublishIngressTplComponent)
  publishTemplateComponent: PublishIngressTplComponent;
  @ViewChild(IngressStatusComponent)
  resourceStatusComponent: IngressStatusComponent;

  // @Input() showState: object;
  // @Input() resources: any[];
  // @Input() templates: any[];
  // @Input() page: Page;
  // @Input() appId: number;
  // @Input() resourceId: number;
  //
  // @Output() paginate = new EventEmitter<State>();
  // @Output() serviceTab = new EventEmitter<number>();
  // @Output() cloneTemplate = new EventEmitter<any>();

  constructor(public ingressTplService: IngressTplService,
              public ingressService: IngressService,
              public tplDetailService: TplDetailService,
              public messageHandlerService: MessageHandlerService,
              public route: ActivatedRoute,
              public aceEditorService: AceEditorService,
              public router: Router,
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
      authService,
      deletionDialogService
    )
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
