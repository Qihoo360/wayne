import {AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import {Location} from '@angular/common';
import {FormBuilder, NgForm} from '@angular/forms';
import {MessageHandlerService} from '../../../shared/message-handler/message-handler.service';
import {
  ConfigMapEnvSource,
  ConfigMapKeySelector,
  Container,
  EnvFromSource,
  EnvVar,
  EnvVarSource,
  KubeCronJob,
  ResourceRequirements,
  SecretEnvSource,
  SecretKeySelector,
} from '../../../shared/model/v1/kubernetes/cronjob';
import {DOCUMENT, EventManager} from '@angular/platform-browser';
import 'rxjs/add/observable/combineLatest';
import {ActivatedRoute, Router} from '@angular/router';
import {CronjobTpl} from '../../../shared/model/v1/cronjobtpl';
import {App} from '../../../shared/model/v1/app';
import {Cronjob} from '../../../shared/model/v1/cronjob';
import {CronjobTplService} from '../../../shared/client/v1/cronjobtpl.service';
import {CronjobService} from '../../../shared/client/v1/cronjob.service';
import {AppService} from '../../../shared/client/v1/app.service';
import {ActionType, defaultResources, appLabelKey, componentLabelKey, namespaceLabelKey} from '../../../shared/shared.const';
import {mergeDeep, ResourceUnitConvertor, ApiNameGenerateRule} from '../../../shared/utils';
import {CacheService} from '../../../shared/auth/cache.service';
import {AuthService} from '../../../shared/auth/auth.service';
import {AceEditorService} from '../../../shared/ace-editor/ace-editor.service';
import {AceEditorMsg} from '../../../shared/ace-editor/ace-editor';
import {defaultCronJob} from '../../../shared/default-models/cronjob.const';
import {Observable} from 'rxjs';
import * as cron from 'cron-parser'

const templateDom = [
  {
    id: '创建计划任务模版',
    child: [
      {
        id: '发布信息',
      },
      {
        id: '计划任务配置'
      }
    ]
  }
];

const containerDom = {
  id: '容器配置',
  child: [
    {
      id: '镜像配置'
    },
    {
      id: '环境变量配置'
    }
  ]
};

@Component({
  selector: 'create-edit-cronjobtpl',
  templateUrl: 'create-edit-cronjobtpl.component.html',
  styleUrls: ['create-edit-cronjobtpl.scss']
})
export class CreateEditCronjobTplComponent implements OnInit, AfterViewInit, OnDestroy {
  ngForm: NgForm;
  @ViewChild('ngForm')
  currentForm: NgForm;

  actionType: ActionType;
  cronjobTpl: CronjobTpl = new CronjobTpl();
  isSubmitOnGoing: boolean = false;
  app: App;
  cronjob: Cronjob;
  kubeCronjob: KubeCronJob = new KubeCronJob();
  componentName = '计划任务模板';
  top: number;
  box: HTMLElement;
  naviList: string = JSON.stringify(templateDom);
  eventList: any = new Array();

  constructor(private cronjobTplService: CronjobTplService,
              private fb: FormBuilder,
              private aceEditorService: AceEditorService,
              public authService: AuthService,
              public cacheService: CacheService,
              private router: Router,
              private location: Location,
              private cronjobService: CronjobService,
              private appService: AppService,
              private route: ActivatedRoute,
              private messageHandlerService: MessageHandlerService,
              @Inject(DOCUMENT) private document: any,
              private eventManager: EventManager
  ) {
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
      }, 0)
    }
  }

  get containersLength(): number {
    try {
      return this.kubeCronjob.spec.jobTemplate.spec.template.spec.containers.length;
    } catch (error) {
      return 0;
    }
  }

  setContainDom(i) {
    let dom = JSON.parse(JSON.stringify(containerDom));
    dom.id += i ? i : '';
    dom.child.forEach(item => {
      item.id += i ? i : '';
    })
    return dom
  }

  initNavList() {
    this.naviList = null;
    let naviList = JSON.parse(JSON.stringify(templateDom));
    for (let key = 0; key < this.containersLength; key++) {
      naviList[0].child.push(this.setContainDom(key));
    }
    this.naviList = JSON.stringify(naviList);
  }

  get isScheduleValid(): boolean {
    if (!this.kubeCronjob.spec.schedule) return false;
    let result = cron.parseString(this.kubeCronjob.spec.schedule);
    if (Object.keys(result.errors).length != 0) {
      return false;
    }
    return true;
  }

  formValid(field: string): boolean {
    const control = this.currentForm.controls[field];
    if (control && control.dirty && !control.valid) {
      return true;
    }
    return false;
  }

  containerIsInvalid(index: number, field: string): boolean {
    const control = this.currentForm.controls[field + index];
    if (control && control.dirty && !control.valid) {
      return true;
    }
    return false;
  }

  checkMemory(memory: string): boolean {
    return memory === '' ? true : parseFloat(memory) <= this.memoryLimit && parseFloat(memory) > 0
  }

  checkCpu(cpu: string): boolean {
    return cpu === '' ? true : parseFloat(cpu) <= this.cpuLimit && parseFloat(cpu) > 0
  }

  get memoryLimit(): number {
    let memoryLimit = defaultResources.memoryLimit;
    if (this.cronjob && this.cronjob.metaData) {
      let metaData = JSON.parse(this.cronjob.metaData);
      if (metaData.resources &&
        metaData.resources.memoryLimit) {
        memoryLimit = parseInt(metaData.resources.memoryLimit)
      }
    }
    return memoryLimit
  }

  get cpuLimit(): number {
    let cpuLimit = defaultResources.cpuLimit;
    if (this.cronjob && this.cronjob.metaData) {
      let metaData = JSON.parse(this.cronjob.metaData);
      if (metaData.resources &&
        metaData.resources.cpuLimit) {
        cpuLimit = parseInt(metaData.resources.cpuLimit)
      }
    }
    return cpuLimit
  }

  initDefault() {
    this.kubeCronjob = JSON.parse(defaultCronJob);
    this.kubeCronjob.spec.jobTemplate.spec.template.spec.containers.push(this.defaultContainer());
  }

  defaultContainer(): Container {
    let container = new Container();
    container.resources = new ResourceRequirements();
    container.resources.limits = {'memory': '', 'cpu': ''};
    container.env = [];
    container.envFrom = [];
    return container;
  }

  ngOnInit(): void {
    this.initDefault();
    let appId = parseInt(this.route.parent.snapshot.params['id']);
    let namespaceId = this.cacheService.namespaceId;
    let cronjobId = parseInt(this.route.snapshot.params['cronjobId']);
    let tplId = parseInt(this.route.snapshot.params['tplId']);
    let observables = Array(
      this.appService.getById(appId, namespaceId),
      this.cronjobService.getById(cronjobId, appId)
    );
    if (tplId) {
      this.actionType = ActionType.EDIT;
      observables.push(this.cronjobTplService.getById(tplId, appId));
    } else {
      this.actionType = ActionType.ADD_NEW;
    }
    Observable.combineLatest(observables).subscribe(
      response => {
        this.app = response[0].data;
        this.cronjob = response[1].data;
        let tpl = response[2];
        if (tpl) {
          this.cronjobTpl = tpl.data;
          this.cronjobTpl.description = null;
          this.saveCronjob(JSON.parse(this.cronjobTpl.template));
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
    labels[this.authService.config[componentLabelKey]] = ApiNameGenerateRule.extractName(this.cronjob.name, this.app.name);
    labels[this.authService.config[namespaceLabelKey]] = this.cacheService.currentNamespace.name;
    labels['app'] = this.cronjob.name;
    return labels;
  }

  fillCronjobLabel(kubeCronJob: KubeCronJob): KubeCronJob {
    kubeCronJob.metadata.name = this.cronjob.name;
    kubeCronJob.metadata.labels = this.buildLabels(this.kubeCronjob.metadata.labels);
    kubeCronJob.spec.jobTemplate.metadata.labels = this.buildLabels(this.kubeCronjob.spec.jobTemplate.metadata.labels);
    kubeCronJob.spec.jobTemplate.spec.template.metadata.labels = this.buildLabels(this.kubeCronjob.spec.jobTemplate.spec.template.metadata.labels);
    return kubeCronJob;
  }

  onDeleteContainer(index: number) {
    this.kubeCronjob.spec.jobTemplate.spec.template.spec.containers.splice(index, 1);
    this.initNavList();
  }

  onAddContainer() {
    this.kubeCronjob.spec.jobTemplate.spec.template.spec.containers.push(this.defaultContainer());
    this.initNavList();
  }

  onAddEnv(index: number) {
    if (!this.kubeCronjob.spec.jobTemplate.spec.template.spec.containers[index].env) {
      this.kubeCronjob.spec.jobTemplate.spec.template.spec.containers[index].env = [];
    }
    this.kubeCronjob.spec.jobTemplate.spec.template.spec.containers[index].env.push(this.defaultEnv(0));
  }

  onAddEnvFrom(index: number) {
    if (!this.kubeCronjob.spec.jobTemplate.spec.template.spec.containers[index].envFrom) {
      this.kubeCronjob.spec.jobTemplate.spec.template.spec.containers[index].envFrom = [];
    }
    this.kubeCronjob.spec.jobTemplate.spec.template.spec.containers[index].envFrom.push(this.defaultEnvFrom(1));
  }

  onDeleteEnv(i: number, j: number) {
    this.kubeCronjob.spec.jobTemplate.spec.template.spec.containers[i].env.splice(j, 1);
  }

  onDeleteEnvFrom(i: number, j: number) {
    this.kubeCronjob.spec.jobTemplate.spec.template.spec.containers[i].envFrom.splice(j, 1);
  }

  envChange(type: number, i: number, j: number) {
    this.kubeCronjob.spec.jobTemplate.spec.template.spec.containers[i].env[j] = this.defaultEnv(type);
  }

  envFromChange(type: number, i: number, j: number) {
    this.kubeCronjob.spec.jobTemplate.spec.template.spec.containers[i].envFrom[j] = this.defaultEnvFrom(type);
  }

  defaultEnv(type: number): EnvVar {
    let env = new EnvVar();
    switch (parseInt(type.toString())) {
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
    let envFrom = new EnvFromSource();
    switch (parseInt(type.toString())) {
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

    let newState = JSON.parse(JSON.stringify(this.kubeCronjob));
    newState = this.generateCronJob(newState);
    this.cronjobTpl.cronjobId = this.cronjob.id;
    this.cronjobTpl.template = JSON.stringify(newState);

    this.cronjobTpl.id = undefined;
    this.cronjobTpl.name = this.cronjob.name;
    this.cronjobTplService.create(this.cronjobTpl, this.app.id).subscribe(
      status => {
        this.isSubmitOnGoing = false;
        this.messageHandlerService.showSuccess('创建' + this.componentName + '模版成功！');
        this.router.navigate([`portal/namespace/${this.cacheService.namespaceId}/app/${this.app.id}/cronjob/${this.cronjob.id}`]);
      },
      error => {
        this.isSubmitOnGoing = false;
        this.messageHandlerService.handleError(error);
      }
    );
  }

  generateCronJob(kubeCronjob: KubeCronJob): KubeCronJob {
    kubeCronjob = mergeDeep(JSON.parse(defaultCronJob), kubeCronjob);
    this.kubeCronjob = mergeDeep(JSON.parse(defaultCronJob), this.kubeCronjob);
    kubeCronjob = this.addResourceUnit(kubeCronjob);
    kubeCronjob = this.fillCronjobLabel(kubeCronjob);

    return kubeCronjob
  }

  saveCronjob(kubeCronjob: KubeCronJob) {
    // this.removeResourceUnit(kubeStatefulSet);
    this.fillDefault(kubeCronjob);
    this.kubeCronjob = kubeCronjob;
    this.initNavList();
  }

  fillDefault(kubeCronjob: KubeCronJob) {
    this.kubeCronjob = mergeDeep(JSON.parse(defaultCronJob), kubeCronjob);
    if (this.kubeCronjob.spec.jobTemplate.spec.template.spec.containers && this.kubeCronjob.spec.jobTemplate.spec.template.spec.containers.length > 0) {
      for (let container of this.kubeCronjob.spec.jobTemplate.spec.template.spec.containers) {
        if (!container.resources) {
          container.resources = ResourceRequirements.emptyObject()
        }
        if (!container.resources.limits) {
          container.resources.limits = {'cpu': '0', 'memory': '0Gi'}
        }
        container.resources.limits['cpu'] = ResourceUnitConvertor.cpuCoreValue(container.resources.limits['cpu']);
        container.resources.limits['memory'] = ResourceUnitConvertor.memoryGiValue(container.resources.limits['memory']);
      }
    }
  }

  addResourceUnit(kubeCronjob: KubeCronJob): KubeCronJob {
    let cpuRequestLimitPercent = 0.5;
    let memoryRequestLimitPercent = 1;
    if (this.cronjob.metaData) {
      let metaData = JSON.parse(this.cronjob.metaData);
      if (metaData.resources && metaData.resources.cpuRequestLimitPercent) {
        if (metaData.resources.cpuRequestLimitPercent.indexOf('%') > -1) {
          cpuRequestLimitPercent = parseFloat(metaData.resources.cpuRequestLimitPercent.replace('%', '')) / 100
        } else {
          cpuRequestLimitPercent = parseFloat(metaData.resources.cpuRequestLimitPercent)
        }
      }
      if (metaData.resources && metaData.resources.memoryRequestLimitPercent) {
        if (metaData.resources.memoryRequestLimitPercent.indexOf('%') > -1) {
          memoryRequestLimitPercent = parseFloat(metaData.resources.memoryRequestLimitPercent.replace('%', '')) / 100
        } else {
          memoryRequestLimitPercent = parseFloat(metaData.resources.memoryRequestLimitPercent)
        }
      }
    }

    for (let container of kubeCronjob.spec.jobTemplate.spec.template.spec.containers) {
      let memoryLimit = container.resources.limits['memory'];
      let cpuLimit = container.resources.limits['cpu'];
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
    return kubeCronjob
  }

  public get isValid(): boolean {
    return this.currentForm &&
      this.currentForm.valid &&
      !this.isSubmitOnGoing && this.isScheduleValid;
  }

  onCancel() {
    this.currentForm.reset();
    this.location.back();
  }

  getImagePrefixReg() {
    let imagePrefix = this.authService.config['system.image-prefix'];
    return imagePrefix
  }

  openModal(): void {
    // let copy = Object.assign({}, myObject).
    // but this wont work for nested objects. SO an alternative would be
    let newState = JSON.parse(JSON.stringify(this.kubeCronjob));
    newState = this.generateCronJob(newState);
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(newState, true));
  }

}
