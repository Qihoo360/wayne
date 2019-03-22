import { AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { DOCUMENT, Location } from '@angular/common';
import { EventManager } from '@angular/platform-browser';
import { FormBuilder, NgForm } from '@angular/forms';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import {
  ConfigMapEnvSource,
  ConfigMapKeySelector,
  Container,
  DaemonSetUpdateStrategy,
  EnvFromSource,
  EnvVar,
  EnvVarSource,
  ExecAction,
  HTTPGetAction,
  KubeDaemonSet,
  ObjectMeta,
  Probe,
  ResourceRequirements,
  SecretEnvSource,
  SecretKeySelector,
  TCPSocketAction
} from '../../../shared/model/v1/kubernetes/daemonset';
import 'rxjs/add/observable/combineLatest';
import { ActivatedRoute, Router } from '@angular/router';
import { App } from '../../../shared/model/v1/app';
import { AppService } from '../../../shared/client/v1/app.service';
import { ActionType, appLabelKey, defaultResources, namespaceLabelKey } from '../../../shared/shared.const';
import { CacheService } from '../../../shared/auth/cache.service';
import { combineLatest } from 'rxjs';
import { AuthService } from '../../../shared/auth/auth.service';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { AceEditorMsg } from '../../../shared/ace-editor/ace-editor';
import { DaemonSetTemplate } from '../../../shared/model/v1/daemonsettpl';
import { DaemonSet } from '../../../shared/model/v1/daemonset';
import { DaemonSetService } from '../../../shared/client/v1/daemonset.service';
import { DaemonSetTplService } from '../../../shared/client/v1/daemonsettpl.service';
import { defaultDaemonSet } from '../../../shared/default-models/daemonset.const';
import { ResourceUnitConvertor } from '../../../shared/utils';
import { TranslateService } from '@ngx-translate/core';
import { containerDom, ContainerTpl, templateDom } from '../../../shared/base/container/container-tpl';

@Component({
  selector: 'create-edit-daemonsettpl',
  templateUrl: 'create-edit-daemonsettpl.component.html',
  styleUrls: ['create-edit-daemonsettpl.scss']
})
export class CreateEditDaemonSetTplComponent extends ContainerTpl implements OnInit, AfterViewInit, OnDestroy {
  ngForm: NgForm;
  @ViewChild('ngForm')
  currentForm: NgForm;

  actionType: ActionType;
  daemonSetTpl = new DaemonSetTemplate();
  isSubmitOnGoing = false;
  app: App;
  daemonSet: DaemonSet;

  cpuUnitPrice = 30;
  memoryUnitPrice = 10;
  top: number;
  box: HTMLElement;
  eventList: any = Array();

  constructor(private daemonSetTplService: DaemonSetTplService,
              private fb: FormBuilder,
              private router: Router,
              private aceEditorService: AceEditorService,
              public authService: AuthService,
              private location: Location,
              private daemonSetService: DaemonSetService,
              private appService: AppService,
              public cacheService: CacheService,
              private route: ActivatedRoute,
              private messageHandlerService: MessageHandlerService,
              @Inject(DOCUMENT) private document: any,
              public translate: TranslateService,
              private eventManager: EventManager) {
    super(templateDom, containerDom);
  }

  ngAfterViewInit() {
    this.box = this.document.querySelector('.content-area');
    this.box.style.paddingBottom = '60px';
    this.eventList.push(
      this.eventManager.addEventListener(this.box, 'scroll', this.scrollEvent.bind(this, true)),
      this.eventManager.addGlobalEventListener('window', 'resize', this.scrollEvent.bind(this, false))
    );
    this.scrollEvent(false);
  }

  ngOnDestroy() {
    this.eventList.forEach(item => {
      item();
    });
    this.box.style.paddingBottom = '.75rem';
  }

  scrollEvent(scroll: boolean, event?) {
    let top = 0;
    if (event && scroll) {
      top = event.target.scrollTop;
      this.top = top + this.box.offsetHeight - 48;
    } else {
      // hack
      setTimeout(() => {
        this.top = this.box.scrollTop + this.box.offsetHeight - 48;
      }, 0);
    }
  }

  checkIfInvalid(index: number, field: string): boolean {
    const control = this.currentForm.controls[field + index];
    if (control && control.dirty && !control.valid) {
      return true;
    }
    return false;
  }

  checkMemory(memory: string): boolean {
    return memory === '' ? true : parseFloat(memory) <= this.memoryLimit && parseFloat(memory) > 0;
  }

  checkCpu(cpu: string): boolean {
    return cpu === '' ? true : parseFloat(cpu) <= this.cpuLimit && parseFloat(cpu) > 0;
  }

  get memoryLimit(): number {
    let memoryLimit = defaultResources.memoryLimit;
    if (this.daemonSet && this.daemonSet.metaData) {
      const metaData = JSON.parse(this.daemonSet.metaData);
      if (metaData.resources &&
        metaData.resources.memoryLimit) {
        memoryLimit = parseInt(metaData.resources.memoryLimit, 10);
      }
    }
    return memoryLimit;
  }

  get cpuLimit(): number {
    let cpuLimit = defaultResources.cpuLimit;
    if (this.daemonSet && this.daemonSet.metaData) {
      const metaData = JSON.parse(this.daemonSet.metaData);
      if (metaData.resources &&
        metaData.resources.cpuLimit) {
        cpuLimit = parseInt(metaData.resources.cpuLimit, 10);
      }
    }
    return cpuLimit;
  }

  ngOnInit(): void {
    this.initDefault();
    const appId = parseInt(this.route.parent.snapshot.params['id'], 10);
    const namespaceId = this.cacheService.namespaceId;
    const daemonSetId = parseInt(this.route.snapshot.params['daemonSetId'], 10);
    const tplId = parseInt(this.route.snapshot.params['tplId'], 10);
    const observables = Array(
      this.appService.getById(appId, namespaceId),
      this.daemonSetService.getById(daemonSetId, appId)
    );
    if (tplId) {
      this.actionType = ActionType.EDIT;
      observables.push(this.daemonSetTplService.getById(tplId, appId));
    } else {
      this.actionType = ActionType.ADD_NEW;
    }
    combineLatest(observables).subscribe(
      response => {
        this.app = response[0].data;
        this.daemonSet = response[1].data;
        const tpl = response[2];
        if (tpl) {
          this.daemonSetTpl = tpl.data;

          this.daemonSetTpl.description = null;
          this.saveDaemonSet(JSON.parse(this.daemonSetTpl.template));
        }
        this.initNavList();
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }

  buildLabels(labels: {}) {
    if (!labels) {
      labels = {};
    }
    labels[this.authService.config[appLabelKey]] = this.app.name;
    labels[this.authService.config[namespaceLabelKey]] = this.cacheService.currentNamespace.name;
    labels['app'] = this.daemonSet.name;
    return labels;
  }

  buildSelectorLabels(labels: {}) {
    if (Object.keys(labels).length > 0) {
      return labels;
    }
    const result = {};
    result['app'] = this.daemonSet.name;
    return result;
  }

  fillLabel(kubeResource: KubeDaemonSet): KubeDaemonSet {
    kubeResource.metadata.name = this.daemonSet.name;
    kubeResource.metadata.labels = this.buildLabels(this.kubeResource.metadata.labels);
    kubeResource.spec.selector.matchLabels = this.buildSelectorLabels(this.kubeResource.spec.selector.matchLabels);
    kubeResource.spec.template.metadata.labels = this.buildLabels(this.kubeResource.spec.template.metadata.labels);
    return kubeResource;
  }

  initDefault() {
    this.kubeResource = JSON.parse(defaultDaemonSet);
    this.kubeResource.spec.template.spec.containers.push(this.defaultContainer());
    this.initNavList();
  }

  onDeleteContainer(index: number) {
    this.kubeResource.spec.template.spec.containers.splice(index, 1);
    this.initNavList();
  }

  onAddContainer() {
    this.kubeResource.spec.template.spec.containers.push(this.defaultContainer());
    this.initNavList();
  }

  onAddEnv(index: number, event: Event) {
    event.stopPropagation();
    if (!this.kubeResource.spec.template.spec.containers[index].env) {
      this.kubeResource.spec.template.spec.containers[index].env = [];
    }
    this.kubeResource.spec.template.spec.containers[index].env.push(this.defaultEnv(0));
  }

  onAddEnvFrom(index: number, event: Event) {
    event.stopPropagation();
    if (!this.kubeResource.spec.template.spec.containers[index].envFrom) {
      this.kubeResource.spec.template.spec.containers[index].envFrom = [];
    }
    this.kubeResource.spec.template.spec.containers[index].envFrom.push(this.defaultEnvFrom(1));
  }

  onDeleteEnv(i: number, j: number) {
    this.kubeResource.spec.template.spec.containers[i].env.splice(j, 1);
  }

  onDeleteEnvFrom(i: number, j: number) {
    this.kubeResource.spec.template.spec.containers[i].envFrom.splice(j, 1);
  }

  envChange(type: number, i: number, j: number) {
    this.kubeResource.spec.template.spec.containers[i].env[j] = this.defaultEnv(type);
  }

  envFromChange(type: number, i: number, j: number) {
    this.kubeResource.spec.template.spec.containers[i].envFrom[j] = this.defaultEnvFrom(type);
  }

  defaultEnvFrom(type: number): EnvFromSource {
    const envFrom = new EnvFromSource();
    switch (parseInt(type.toString(), 10)) {
      case 1:
        envFrom.configMapRef = new ConfigMapEnvSource();
        break;
      case 2:
        envFrom.secretRef = new SecretEnvSource();
        break;
    }
    return envFrom;
  }

  readinessProbeChange(i: number) {
    let probe = this.kubeResource.spec.template.spec.containers[i].readinessProbe;
    if (probe) {
      probe = undefined;
    } else {
      probe = new Probe();
      probe.httpGet = new HTTPGetAction();
      probe.timeoutSeconds = 1;
      probe.periodSeconds = 10;
      probe.failureThreshold = 10;
    }
    this.kubeResource.spec.template.spec.containers[i].readinessProbe = probe;
  }

  livenessProbeChange(i: number) {
    let probe = this.kubeResource.spec.template.spec.containers[i].livenessProbe;
    if (probe) {
      probe = undefined;
    } else {
      probe = new Probe();
      probe.httpGet = new HTTPGetAction();
      probe.timeoutSeconds = 1;
      probe.periodSeconds = 10;
      probe.failureThreshold = 10;
      probe.initialDelaySeconds = 30;
    }
    this.kubeResource.spec.template.spec.containers[i].livenessProbe = probe;
  }

  probeTypeChange(probe: Probe, type: number) {
    switch (parseInt(type.toString(), 10)) {
      case 0:
        probe.httpGet = new HTTPGetAction();
        probe.tcpSocket = undefined;
        probe.exec = undefined;
        break;
      case 1:
        probe.tcpSocket = new TCPSocketAction();
        probe.httpGet = undefined;
        probe.exec = undefined;
        break;
      case 2:
        probe.exec = new ExecAction();
        probe.exec.command = [];
        probe.exec.command.push('');
        probe.httpGet = undefined;
        probe.tcpSocket = undefined;
        break;
    }

  }

  livenessProbeTypeChange(type: number, i: number) {
    this.probeTypeChange(this.kubeResource.spec.template.spec.containers[i].livenessProbe, type);
  }

  readinessProbeTypeChange(type: number, i: number) {
    this.probeTypeChange(this.kubeResource.spec.template.spec.containers[i].readinessProbe, type);
  }

  trackByFn(index, item) {
    return index;
  }

  defaultContainer(): Container {
    const container = new Container();
    container.resources = new ResourceRequirements();
    container.resources.limits = {'memory': '', 'cpu': ''};
    container.env = [];
    container.envFrom = [];
    container.imagePullPolicy = 'IfNotPresent';
    return container;
  }

  defaultEnv(type: number): EnvVar {
    const env = new EnvVar();
    switch (parseInt(type.toString(), 10)) {
      case 0:
        env.value = '';
        break;
      case 1:
        env.valueFrom = new EnvVarSource();
        env.valueFrom.configMapKeyRef = new ConfigMapKeySelector();
        break;
      case 2:
        env.valueFrom = new EnvVarSource();
        env.valueFrom.secretKeyRef = new SecretKeySelector();
        break;
      case 3:
        break;
    }
    return env;
  }

  onSubmit() {
    if (this.isSubmitOnGoing) {
      return;
    }
    this.isSubmitOnGoing = true;
    // let copy = Object.assign({}, myObject).
    // but this wont work for nested objects. SO an alternative would be
    let newDaemonSet = JSON.parse(JSON.stringify(this.kubeResource));
    newDaemonSet = this.generateDaemonSet(newDaemonSet);
    this.daemonSetTpl.daemonSetId = this.daemonSet.id;
    this.daemonSetTpl.template = JSON.stringify(newDaemonSet);
    this.daemonSetTpl.id = undefined;
    this.daemonSetTpl.name = this.daemonSet.name;
    this.daemonSetTplService.create(this.daemonSetTpl, this.app.id).subscribe(
      status => {
        this.isSubmitOnGoing = false;
        this.messageHandlerService.showSuccess('创建模版成功！');
        this.router.navigate([`portal/namespace/${this.cacheService.namespaceId}/app/${this.app.id}/daemonset/${this.daemonSet.id}`]);
      },
      error => {
        this.isSubmitOnGoing = false;
        this.messageHandlerService.handleError(error);

      }
    );

  }

  addResourceUnit(kubeResource: KubeDaemonSet): KubeDaemonSet {
    let cpuRequestLimitPercent = 0.5;
    let memoryRequestLimitPercent = 1;
    if (this.daemonSet.metaData) {
      const metaData = JSON.parse(this.daemonSet.metaData);
      if (metaData.resources && metaData.resources.cpuRequestLimitPercent) {
        if (metaData.resources.cpuRequestLimitPercent.indexOf('%') > -1) {
          cpuRequestLimitPercent = parseFloat(metaData.resources.cpuRequestLimitPercent.replace('%', '')) / 100;
        } else {
          cpuRequestLimitPercent = parseFloat(metaData.resources.cpuRequestLimitPercent);
        }
      }
      if (metaData.resources && metaData.resources.memoryRequestLimitPercent) {
        if (metaData.resources.memoryRequestLimitPercent.indexOf('%') > -1) {
          memoryRequestLimitPercent = parseFloat(metaData.resources.memoryRequestLimitPercent.replace('%', '')) / 100;
        } else {
          memoryRequestLimitPercent = parseFloat(metaData.resources.memoryRequestLimitPercent);
        }
      }
    }

    for (const container of kubeResource.spec.template.spec.containers) {
      const memoryLimit = container.resources.limits['memory'];
      const cpuLimit = container.resources.limits['cpu'];
      if (!container.resources.requests) {
        container.resources.requests = {};
      }
      if (memoryLimit) {
        container.resources.limits['memory'] = memoryLimit + 'Gi';
        container.resources.requests['memory'] = parseFloat(memoryLimit) * memoryRequestLimitPercent + 'Gi';
      }
      if (cpuLimit) {
        container.resources.limits['cpu'] = cpuLimit.toString();
        container.resources.requests['cpu'] = (parseFloat(cpuLimit) * cpuRequestLimitPercent).toString();
      }
    }
    return kubeResource;
  }


  get totalFee() {
    let fee = 0;
    if (this.kubeResource.spec.template.spec.containers) {
      for (const container of this.kubeResource.spec.template.spec.containers) {
        const limit = container.resources.limits;
        const cpu = limit['cpu'];
        const memory = limit['memory'];
        if (cpu) {
          fee += parseFloat(cpu) * this.cpuUnitPrice;
        }
        if (memory) {
          fee += parseFloat(memory) * this.memoryUnitPrice;
        }

      }
    }
    return fee;
  }

  saveDaemonSet(kubeResource: KubeDaemonSet) {
    this.removeUnused(kubeResource);
    this.fillDefault(kubeResource);
    this.convertProbeCommandToText(kubeResource);
    this.kubeResource = kubeResource;
    this.initNavList();
  }

  // remove unused fields, deal with user advanced mode paste yaml/json manually
  removeUnused(obj: KubeDaemonSet) {
    const metaData = new ObjectMeta();
    metaData.name = obj.metadata.name;
    metaData.namespace = obj.metadata.namespace;
    metaData.labels = obj.metadata.labels;
    metaData.annotations = obj.metadata.annotations;
    obj.metadata = metaData;
    obj.status = undefined;
  }

  convertProbeCommandToText(kubeResource: KubeDaemonSet) {
    if (kubeResource.spec.template.spec.containers && kubeResource.spec.template.spec.containers.length > 0) {
      for (const container of kubeResource.spec.template.spec.containers) {
        if (container.livenessProbe && container.livenessProbe.exec &&
          container.livenessProbe.exec.command && container.livenessProbe.exec.command.length > 0) {
          const commands = container.livenessProbe.exec.command;
          container.livenessProbe.exec.command = Array();
          container.livenessProbe.exec.command.push(commands.join('\n'));
        }
        if (container.readinessProbe && container.readinessProbe.exec &&
          container.readinessProbe.exec.command && container.readinessProbe.exec.command.length > 0) {
          const commands = container.readinessProbe.exec.command;
          container.readinessProbe.exec.command = Array();
          container.readinessProbe.exec.command.push(commands.join('\n'));
        }
      }
    }

    return kubeResource;
  }

  fillDefault(kubeResource: KubeDaemonSet) {
    if (!kubeResource.spec.updateStrategy) {
      kubeResource.spec.updateStrategy = DaemonSetUpdateStrategy.emptyObject();
      kubeResource.spec.updateStrategy.type = 'OnDelete';
    }
    if (kubeResource.spec.template.spec.containers && kubeResource.spec.template.spec.containers.length > 0) {
      for (const container of kubeResource.spec.template.spec.containers) {
        if (!container.resources) {
          container.resources = ResourceRequirements.emptyObject();
        }
        if (!container.resources.limits) {
          container.resources.limits = {'cpu': '0', 'memory': '0Gi'};
        }
        container.resources.limits['cpu'] = ResourceUnitConvertor.cpuCoreValue(container.resources.limits['cpu']);
        container.resources.limits['memory'] = ResourceUnitConvertor.memoryGiValue(container.resources.limits['memory']);
      }
    }
  }

  generateDaemonSet(kubeResource: KubeDaemonSet): KubeDaemonSet {
    kubeResource = this.convertProbeCommandToArray(kubeResource);
    kubeResource = this.addResourceUnit(kubeResource);
    kubeResource = this.fillLabel(kubeResource);
    return kubeResource;
  }

  convertProbeCommandToArray(kubeResource: KubeDaemonSet): KubeDaemonSet {
    if (kubeResource.spec.template.spec.containers && kubeResource.spec.template.spec.containers.length > 0) {
      for (const container of kubeResource.spec.template.spec.containers) {
        if (container.livenessProbe && container.livenessProbe.exec &&
          container.livenessProbe.exec.command && container.livenessProbe.exec.command.length > 0) {
          container.livenessProbe.exec.command = container.livenessProbe.exec.command[0].split('\n');
        }
        if (container.readinessProbe && container.readinessProbe.exec &&
          container.readinessProbe.exec.command && container.readinessProbe.exec.command.length > 0) {
          container.readinessProbe.exec.command = container.readinessProbe.exec.command[0].split('\n');
        }
      }
    }

    return kubeResource;
  }

  openModal(): void {
    // let copy = Object.assign({}, myObject).
    // but this wont work for nested objects. SO an alternative would be
    let newDaemonSet = JSON.parse(JSON.stringify(this.kubeResource));
    newDaemonSet = this.generateDaemonSet(newDaemonSet);
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(newDaemonSet, true));
  }

  onCancel() {
    this.currentForm.reset();
    this.location.back();
  }

  public get isValid(): boolean {
    return this.currentForm &&
      this.currentForm.valid &&
      !this.isSubmitOnGoing;
  }

  getImagePrefixReg() {
    const imagePrefix = this.authService.config['system.image-prefix'];
    return imagePrefix;
  }
}
