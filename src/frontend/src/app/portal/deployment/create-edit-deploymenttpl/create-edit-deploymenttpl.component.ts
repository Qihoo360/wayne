import { AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { DOCUMENT, Location } from '@angular/common';
import { FormBuilder, NgForm } from '@angular/forms';
import { EventManager } from '@angular/platform-browser';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import {
  ConfigMapEnvSource,
  ConfigMapKeySelector,
  Container,
  DeploymentStrategy,
  EnvFromSource,
  EnvVar,
  EnvVarSource,
  ExecAction,
  Handler,
  HTTPGetAction,
  KubeDeployment,
  Lifecycle,
  ObjectMeta,
  Probe,
  ResourceRequirements,
  RollingUpdateDeployment,
  SecretEnvSource,
  SecretKeySelector,
  TCPSocketAction,
} from '../../../shared/model/v1/kubernetes/deployment';
import 'rxjs/add/observable/combineLatest';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { DeploymentTpl } from '../../../shared/model/v1/deploymenttpl';
import { App } from '../../../shared/model/v1/app';
import { Deployment } from '../../../shared/model/v1/deployment';
import { DeploymentTplService } from '../../../shared/client/v1/deploymenttpl.service';
import { DeploymentService } from '../../../shared/client/v1/deployment.service';
import { AppService } from '../../../shared/client/v1/app.service';
import { ActionType, appLabelKey, defaultResources, namespaceLabelKey } from '../../../shared/shared.const';
import { ResourceUnitConvertor } from '../../../shared/utils';
import { CacheService } from '../../../shared/auth/cache.service';
import { AuthService } from '../../../shared/auth/auth.service';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { AceEditorMsg } from '../../../shared/ace-editor/ace-editor';
import { defaultDeployment } from '../../../shared/default-models/deployment.const';
import { containerDom, ContainerTpl, templateDom } from '../../../shared/base/container/container-tpl';



@Component({
  selector: 'create-edit-deploymenttpl',
  templateUrl: 'create-edit-deploymenttpl.component.html',
  styleUrls: ['create-edit-deploymenttpl.scss']
})

export class CreateEditDeploymentTplComponent extends ContainerTpl implements OnInit, AfterViewInit, OnDestroy {
  ngForm: NgForm;
  @ViewChild('ngForm')
  currentForm: NgForm;

  actionType: ActionType;
  deploymentTpl: DeploymentTpl = new DeploymentTpl();
  isSubmitOnGoing = false;
  app: App;
  deployment: Deployment;

  cpuUnitPrice = 30;
  memoryUnitPrice = 10;
  top: number;
  box: HTMLElement;
  eventList: any[] = Array();
  defaultSafeExecCommand = 'sleep\n30';

  constructor(private deploymentTplService: DeploymentTplService,
              private aceEditorService: AceEditorService,
              private fb: FormBuilder,
              private router: Router,
              private location: Location,
              private deploymentService: DeploymentService,
              private appService: AppService,
              public authService: AuthService,
              public cacheService: CacheService,
              private route: ActivatedRoute,
              private messageHandlerService: MessageHandlerService,
              @Inject(DOCUMENT) private document: any,
              private eventManager: EventManager) {
    super(templateDom, containerDom);
  }

  formValid(field: string): boolean {
    const control = this.currentForm.controls[field];
    if (control && control.dirty && !control.valid) {
      return true;
    }
    return false;
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
    this.box.style.paddingBottom = '0.75rem';
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

  containerIsInvalid(index: number, field: string): boolean {
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
    if (this.deployment && this.deployment.metaData) {
      const metaData = JSON.parse(this.deployment.metaData);
      if (metaData.resources &&
        metaData.resources.memoryLimit) {
        memoryLimit = parseInt(metaData.resources.memoryLimit, 10);
      }
    }
    return memoryLimit;
  }

  get cpuLimit(): number {
    let cpuLimit = defaultResources.cpuLimit;
    if (this.deployment && this.deployment.metaData) {
      const metaData = JSON.parse(this.deployment.metaData);
      if (metaData.resources &&
        metaData.resources.cpuLimit) {
        cpuLimit = parseInt(metaData.resources.cpuLimit, 10);
      }
    }
    return cpuLimit;
  }

  initDefault() {
    this.kubeResource = JSON.parse(defaultDeployment);
    this.kubeResource.spec.template.spec.containers.push(this.defaultContainer());
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

  ngOnInit(): void {
    this.initDefault();
    const appId = parseInt(this.route.parent.snapshot.params['id'], 10);
    const namespaceId = this.cacheService.namespaceId;
    const deploymentId = parseInt(this.route.snapshot.params['deploymentId'], 10);
    const tplId = parseInt(this.route.snapshot.params['tplId'], 10);
    const observables = Array(
      this.appService.getById(appId, namespaceId),
      this.deploymentService.getById(deploymentId, appId)
    );
    if (tplId) {
      this.actionType = ActionType.EDIT;
      observables.push(this.deploymentTplService.getById(tplId, appId));
    } else {
      this.actionType = ActionType.ADD_NEW;
    }
    combineLatest(observables).subscribe(
      response => {
        this.app = response[0].data;
        this.deployment = response[1].data;
        const tpl = response[2];
        if (tpl) {
          this.deploymentTpl = tpl.data;

          this.deploymentTpl.description = null;
          this.saveDeployment(JSON.parse(this.deploymentTpl.template));
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
    labels['app'] = this.deployment.name;
    return labels;
  }

  buildSelectorLabels(labels: {}) {
    if (Object.keys(labels).length > 0) {
      return labels;
    }
    const result = {};
    result['app'] = this.deployment.name;
    return result;
  }

  fillDeploymentLabel(kubeDeployment: KubeDeployment): KubeDeployment {
    kubeDeployment.metadata.name = this.deployment.name;
    kubeDeployment.metadata.labels = this.buildLabels(this.kubeResource.metadata.labels);
    kubeDeployment.spec.selector.matchLabels = this.buildSelectorLabels(this.kubeResource.spec.selector.matchLabels);
    kubeDeployment.spec.template.metadata.labels = this.buildLabels(this.kubeResource.spec.template.metadata.labels);
    return kubeDeployment;
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

  lifecycleChange(i: number) {
    let lifecycle = this.kubeResource.spec.template.spec.containers[i].lifecycle;
    if (lifecycle) {
      lifecycle = undefined;
    } else {
      lifecycle = new Lifecycle();
      lifecycle.preStop = new Handler();
      lifecycle.preStop.exec = new ExecAction();
      lifecycle.preStop.exec.command = Array(this.defaultSafeExecCommand);
    }
    this.kubeResource.spec.template.spec.containers[i].lifecycle = lifecycle;
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

  lifecyclePostStartProbeTypeChange(type: number, i: number) {
    this.kubeResource.spec.template.spec.containers[i].lifecycle.postStart = this.lifecycleProbeTypeChange(
      this.kubeResource.spec.template.spec.containers[i].lifecycle.postStart, type);
  }

  lifecyclePreStopProbeTypeChange(type: number, i: number) {
    this.kubeResource.spec.template.spec.containers[i].lifecycle.preStop = this.lifecycleProbeTypeChange(
      this.kubeResource.spec.template.spec.containers[i].lifecycle.preStop, type);
  }

  lifecycleProbeTypeChange(handler: Handler, type: number) {
    if (!handler) {
      handler = new Handler();
    }
    switch (parseInt(type.toString(), 10)) {
      case -1:
        handler.httpGet = undefined;
        handler.tcpSocket = undefined;
        handler.exec = undefined;
        break;
      case 0:
        handler.httpGet = new HTTPGetAction();
        handler.tcpSocket = undefined;
        handler.exec = undefined;
        break;
      case 1:
        handler.tcpSocket = new TCPSocketAction();
        handler.httpGet = undefined;
        handler.exec = undefined;
        break;
      case 2:
        handler.exec = new ExecAction();
        handler.exec.command = [];
        handler.exec.command.push('');
        handler.httpGet = undefined;
        handler.tcpSocket = undefined;
        break;
      // for safe exec, for more information https://github.com/kubernetes/kubernetes/issues/47597
      case 3:
        handler.exec = new ExecAction();
        handler.exec.command = [];
        handler.exec.command.push(this.defaultSafeExecCommand);
        handler.httpGet = undefined;
        handler.tcpSocket = undefined;
        break;
    }
    return handler;
  }

  livenessProbeTypeChange(type: number, i: number) {
    this.probeTypeChange(this.kubeResource.spec.template.spec.containers[i].livenessProbe, type);
  }

  readinessProbeTypeChange(type: number, i: number) {
    this.probeTypeChange(this.kubeResource.spec.template.spec.containers[i].readinessProbe, type);
  }

  normalPreStopExecSelected(i: number): boolean {
    const preStop = this.kubeResource.spec.template.spec.containers[i].lifecycle.preStop;
    return preStop && preStop.exec &&
      preStop.exec.command && preStop.exec.command.length > 0 &&
      preStop.exec.command[0] !== this.defaultSafeExecCommand;
  }

  safeExitSelected(i: number): boolean {
    const preStop = this.kubeResource.spec.template.spec.containers[i].lifecycle.preStop;
    return preStop && preStop.exec &&
      preStop.exec.command && preStop.exec.command.length > 0 &&
      preStop.exec.command[0] === this.defaultSafeExecCommand;
  }

  trackByFn(index, item) {
    return index;
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

  onSubmit() {
    if (this.isSubmitOnGoing) {
      return;
    }
    this.isSubmitOnGoing = true;
    let newState = JSON.parse(JSON.stringify(this.kubeResource));
    newState = this.generateDeployment(newState);
    this.deploymentTpl.deploymentId = this.deployment.id;
    this.deploymentTpl.template = JSON.stringify(newState);
    this.deploymentTpl.id = undefined;
    this.deploymentTpl.name = this.deployment.name;
    this.deploymentTplService.create(this.deploymentTpl, this.app.id).subscribe(
      status => {
        this.isSubmitOnGoing = false;
        this.messageHandlerService.showSuccess('创建模版成功！');
        this.router.navigate([`portal/namespace/${this.cacheService.namespaceId}/app/${this.app.id}/deployment/${this.deployment.id}`]);
      },
      error => {
        this.isSubmitOnGoing = false;
        this.messageHandlerService.handleError(error);

      }
    );

  }

  generateDeployment(kubeDeployment: KubeDeployment): KubeDeployment {
    kubeDeployment = this.convertRollingUpdateIntOrString(kubeDeployment);
    kubeDeployment = this.convertProbeCommandToArray(kubeDeployment);
    kubeDeployment = this.addResourceUnit(kubeDeployment);
    kubeDeployment = this.fillDeploymentLabel(kubeDeployment);
    return kubeDeployment;
  }

  convertRollingUpdateIntOrString(kubeDeployment: KubeDeployment) {
    if (kubeDeployment.spec.strategy) {
      if (kubeDeployment.spec.strategy.type === 'RollingUpdate' && kubeDeployment.spec.strategy.rollingUpdate) {
        if (kubeDeployment.spec.strategy.rollingUpdate.maxSurge.toString().indexOf('%') < 0) {
          kubeDeployment.spec.strategy.rollingUpdate.maxSurge = parseInt(
            kubeDeployment.spec.strategy.rollingUpdate.maxSurge.toString(), 10);
        }
        if (kubeDeployment.spec.strategy.rollingUpdate.maxUnavailable.toString().indexOf('%') < 0) {
          kubeDeployment.spec.strategy.rollingUpdate.maxUnavailable = parseInt(
            kubeDeployment.spec.strategy.rollingUpdate.maxUnavailable.toString(), 10);
        }
      }
      if (kubeDeployment.spec.strategy.type === 'Recreate') {
        kubeDeployment.spec.strategy.rollingUpdate = undefined;
      }
    }

    return kubeDeployment;
  }

  convertProbeCommandToArray(kubeDeployment: KubeDeployment): KubeDeployment {
    if (kubeDeployment.spec.template.spec.containers && kubeDeployment.spec.template.spec.containers.length > 0) {
      for (const container of kubeDeployment.spec.template.spec.containers) {
        if (container.livenessProbe && container.livenessProbe.exec && container.livenessProbe.exec.command
          && container.livenessProbe.exec.command.length > 0) {
          container.livenessProbe.exec.command = container.livenessProbe.exec.command[0].split('\n');
        }
        if (container.readinessProbe && container.readinessProbe.exec && container.readinessProbe.exec.command
          && container.readinessProbe.exec.command.length > 0) {
          container.readinessProbe.exec.command = container.readinessProbe.exec.command[0].split('\n');
        }
        if (container.lifecycle) {
          // 置空handler，避免出现 Deployment.apps 'infra-nginx' is invalid: spec.template.spec.containers[0].lifecycle.postStart:
          // Required value: must specify a handler type
          if (container.lifecycle.postStart !== undefined && Object.keys(container.lifecycle.postStart).length === 0) {
            container.lifecycle.postStart = undefined;
          }
          if (container.lifecycle.preStop !== undefined && Object.keys(container.lifecycle.preStop).length === 0) {
            container.lifecycle.preStop = undefined;
          }
          if (container.lifecycle.postStart &&
            container.lifecycle.postStart.exec &&
            container.lifecycle.postStart.exec.command &&
            container.lifecycle.postStart.exec.command.length > 0) {

            container.lifecycle.postStart.exec.command = container.lifecycle.postStart.exec.command[0].split('\n');

          }
          if (container.lifecycle.preStop &&
            container.lifecycle.preStop.exec &&
            container.lifecycle.preStop.exec.command &&
            container.lifecycle.preStop.exec.command.length > 0) {

            container.lifecycle.preStop.exec.command = container.lifecycle.preStop.exec.command[0].split('\n');

          }
        }

      }
    }

    return kubeDeployment;
  }

  addResourceUnit(kubeDeployment: KubeDeployment): KubeDeployment {
    let cpuRequestLimitPercent = 0.5;
    let memoryRequestLimitPercent = 1;
    if (this.deployment.metaData) {
      const metaData = JSON.parse(this.deployment.metaData);
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

    for (const container of kubeDeployment.spec.template.spec.containers) {
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
    return kubeDeployment;
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

  saveDeployment(kubeDeployment: KubeDeployment) {
    // this.removeResourceUnit(kubeStatefulSet);
    this.removeUnused(kubeDeployment);
    this.fillDefault(kubeDeployment);
    this.convertProbeCommandToText(kubeDeployment);
    this.kubeResource = kubeDeployment;
    this.initNavList();
  }

  // remove unused fields, deal with user advanced mode paste yaml/json manually
  removeUnused(obj: KubeDeployment) {
    const metaData = new ObjectMeta();
    metaData.name = obj.metadata.name;
    metaData.namespace = obj.metadata.namespace;
    metaData.labels = obj.metadata.labels;
    metaData.annotations = obj.metadata.annotations;
    obj.metadata = metaData;
    obj.status = undefined;
  }

  convertProbeCommandToText(kubeDeployment: KubeDeployment) {
    if (kubeDeployment.spec.template.spec.containers && kubeDeployment.spec.template.spec.containers.length > 0) {
      for (const container of kubeDeployment.spec.template.spec.containers) {
        if (container.livenessProbe && container.livenessProbe.exec && container.livenessProbe.exec.command
          && container.livenessProbe.exec.command.length > 0) {
          const commands = container.livenessProbe.exec.command;
          container.livenessProbe.exec.command = Array();
          container.livenessProbe.exec.command.push(commands.join('\n'));
        }
        if (container.readinessProbe && container.readinessProbe.exec && container.readinessProbe.exec.command
          && container.readinessProbe.exec.command.length > 0) {
          const commands = container.readinessProbe.exec.command;
          container.readinessProbe.exec.command = Array();
          container.readinessProbe.exec.command.push(commands.join('\n'));
        }
        if (container.lifecycle && container.lifecycle.postStart &&
          container.lifecycle.postStart.exec &&
          container.lifecycle.postStart.exec.command &&
          container.lifecycle.postStart.exec.command.length > 0) {

          const commands = container.lifecycle.postStart.exec.command;
          container.lifecycle.postStart.exec.command = Array();
          container.lifecycle.postStart.exec.command.push(commands.join('\n'));

        }

        if (container.lifecycle && container.lifecycle.preStop &&
          container.lifecycle.preStop.exec &&
          container.lifecycle.preStop.exec.command &&
          container.lifecycle.preStop.exec.command.length > 0) {

          const commands = container.lifecycle.preStop.exec.command;
          container.lifecycle.preStop.exec.command = Array();
          container.lifecycle.preStop.exec.command.push(commands.join('\n'));

        }
      }
    }

    return kubeDeployment;
  }

  fillDefault(kubeDeployment: KubeDeployment) {
    if (!kubeDeployment.spec.strategy) {
      kubeDeployment.spec.strategy = new DeploymentStrategy();
      kubeDeployment.spec.strategy.type = 'RollingUpdate';
    }
    if (kubeDeployment.spec.strategy.type === 'RollingUpdate' && !kubeDeployment.spec.strategy.rollingUpdate) {
      kubeDeployment.spec.strategy.rollingUpdate = new RollingUpdateDeployment();
      kubeDeployment.spec.strategy.rollingUpdate.maxSurge = '20%';
      kubeDeployment.spec.strategy.rollingUpdate.maxUnavailable = 1;
    }
    if (kubeDeployment.spec.template.spec.containers && kubeDeployment.spec.template.spec.containers.length > 0) {
      for (const container of kubeDeployment.spec.template.spec.containers) {
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

  openModal(): void {
    // let copy = Object.assign({}, myObject).
    // but this wont work for nested objects. SO an alternative would be
    let newState = JSON.parse(JSON.stringify(this.kubeResource));
    newState = this.generateDeployment(newState);
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(newState, true));
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
