import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ActionType } from '../../../shared/shared.const';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { AppService } from '../../../shared/client/v1/app.service';
import { CacheService } from '../../../shared/auth/cache.service';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { defaultIngress } from '../../../shared/default-models/ingress.const';
import { IngressTpl } from '../../../shared/model/v1/ingresstpl';
import { IngressService } from '../../../shared/client/v1/ingress.service';
import { IngressTplService } from '../../../shared/client/v1/ingresstpl.service';
import { AuthService } from '../../../shared/auth/auth.service';
import { CreateEditResourceTemplate } from '../../../shared/base/resource/create-edit-resource-template';
import { ServiceService } from '../../../../../lib/shared/client/v1/service.service';
import { Service } from '../../../../../lib/shared/model/service';
import { SecretService } from '../../../shared/client/v1/secret.service';
import { Secret } from '../../../shared/model/v1/secret';
import { IngressBackend, IngressPath, IngressRule } from '../../../shared/model/v1/kubernetes/ingress';


@Component({
  selector: 'create-edit-ingresstpl',
  templateUrl: './create-edit-ingresstpl.component.html',
  styleUrls: ['./create-edit-ingresstpl.scss']
})
export class CreateEditIngressTplComponent extends CreateEditResourceTemplate implements OnInit {
  actionType: ActionType;
  svcs: Service[];
  secrets: Secret[];

  constructor(private ingressTplService: IngressTplService,
              private ingressService: IngressService,
              private serviceService: ServiceService,
              private secretService: SecretService,
              public location: Location,
              public router: Router,
              public appService: AppService,
              public route: ActivatedRoute,
              public authService: AuthService,
              public cacheService: CacheService,
              public aceEditorService: AceEditorService,
              public messageHandlerService: MessageHandlerService
  ) {
    super(
      ingressTplService,
      ingressService,
      location,
      router,
      appService,
      route,
      authService,
      cacheService,
      aceEditorService,
      messageHandlerService
    );
    super.registResourceType('ingress');
    super.registDefaultKubeResource(defaultIngress);
    this.template = new IngressTpl();
  }

  ngOnInit(): void {
    this.kubeResource = JSON.parse(this.defaultKubeResource);

    const appId = parseInt(this.route.parent.snapshot.params['id'], 10);
    const namespaceId = this.cacheService.namespaceId;
    const ingressId = parseInt(this.route.snapshot.params['resourceId'], 10);
    const tplId = parseInt(this.route.snapshot.params['tplId'], 10);
    const observables = Array(
      this.appService.getById(appId, namespaceId),
      this.ingressService.getById(ingressId, appId),
      this.serviceService.getNames(appId),
      this.secretService.getNames(appId)
    );
    if (tplId) {
      this.actionType = ActionType.EDIT;
      observables.push(this.ingressTplService.getById(tplId, appId));
    } else {
      this.actionType = ActionType.ADD_NEW;
    }
    combineLatest(observables).subscribe(
      response => {
        this.app = response[0].data;
        this.resource = response[1].data;
        this.svcs = response[2].data;
        this.secrets = response[3].data;
        const tpl = response[4];
        if (tpl) {
          this.template = tpl.data;
          this.template.description = null;
          this.saveResourceTemplate(JSON.parse(this.template.template));
        }
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }

  isValidResource(): boolean {
    if (super.isValidResource() === false) {
      return false;
    }
    if (this.kubeResource.spec.rules.length === 0) {
      return false;
    }
    if (this.kubeResource.spec.rules.length === 0) {
      return false;
    }
    for (const rule of this.kubeResource.spec.rules) {
      if (rule.host.length === 0) {
        return false;
      }
      if (rule.http.paths.length === 0) {
        return false;
      }
      for (const svc of rule.http.paths) {
        if (svc.backend.servicePort.IntVal === 0 || svc.backend.serviceName.length === 0) {
          return false;
        }
        if (svc.path.length === 0) {
          return false;
        }
      }
    }
    return true;
  }

  // 监听提交表单的事件
  onSubmit() {
    if (this.isSubmitOnGoing) {
      return;
    }
    this.isSubmitOnGoing = true;

    let resourceObj = JSON.parse(JSON.stringify(this.kubeResource));
    resourceObj = this.generateResource(resourceObj);
    this.template.ingressId = this.resource.id;
    this.template.template = JSON.stringify(resourceObj);

    this.template.id = undefined;
    this.template.name = this.resource.name;
    this.template.createTime = this.template.updateTime = new Date();
    this.templateService.create(this.template, this.app.id).subscribe(
      status => {
        this.isSubmitOnGoing = false;
        this.router.navigate(
          [`portal/namespace/${this.cacheService.namespaceId}/app/${this.app.id}/${this.resourceType}/${this.resource.id}`]
        );
        // TODO 路由变化后下面不会生效
        this.messageHandlerService.showSuccess('创建' + this.resourceType + '模板成功！');
      },
      error => {
        this.isSubmitOnGoing = false;
        this.messageHandlerService.handleError(error);

      }
    );
  }

  onAddPath(idx: number) {
    this.kubeResource.spec.rules[idx].http.paths.push(this.defaultIngressPath());
  }

  defaultIngressPath() {
    const ingressPath = new IngressPath();
    ingressPath.path = '/';
    ingressPath.backend = new IngressBackend();
    ingressPath.backend.servicePort = 80;
    return ingressPath;
  }

  onDeletePath(i: number, j: number) {
    this.kubeResource.spec.rules[i].http.paths.splice(j, 1);
  }

  onAddTLS(event: Event) {
    event.stopPropagation();
    this.kubeResource.spec.tls.push({hosts: [''], secretName: ''});
  }

  onDeleteTLS(i: number) {
    this.kubeResource.spec.tls.splice(i, 1);
  }

  onDeleteHost(i: number, j: number) {
    this.kubeResource.spec.tls[i].hosts.splice(j, 1);
  }

  onAddHost(i: number) {
    this.kubeResource.spec.tls[i].hosts.push('');
  }

  onAddRule(event: Event) {
    event.stopPropagation();
    const cngressRule = IngressRule.emptyObject();
    cngressRule.http.paths = [];
    cngressRule.http.paths.push(this.defaultIngressPath());
    this.kubeResource.spec.rules.push(cngressRule);
  }

  onDeleteRule(i: number) {
    this.kubeResource.spec.rules.splice(i, 1);
  }

  trackByFn(index, item) {
    return index;
  }
}

