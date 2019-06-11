import { AfterViewInit, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Location, DOCUMENT } from '@angular/common';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ActionType, appLabelKey, namespaceLabelKey } from '../../../shared/shared.const';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { EventManager } from '@angular/platform-browser';
import { ConfigMapTpl } from '../../../shared/model/v1/configmaptpl';
import { App } from '../../../shared/model/v1/app';
import { ConfigMap } from '../../../shared/model/v1/configmap';
import { KubeConfigMap, ObjectMeta } from '../../../shared/model/v1/kubernetes/configmap';
import { ConfigMapTplService } from '../../../shared/client/v1/configmaptpl.service';
import { ConfigMapService } from '../../../shared/client/v1/configmap.service';
import { AppService } from '../../../shared/client/v1/app.service';
import { Cluster } from '../../../shared/model/v1/cluster';
import { ClusterService } from '../../../shared/client/v1/cluster.service';
import { CacheService } from '../../../shared/auth/cache.service';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { AceEditorMsg } from '../../../shared/ace-editor/ace-editor';
import { AuthService } from '../../../shared/auth/auth.service';

@Component({
  selector: 'create-edit-configmaptpl',
  templateUrl: 'create-edit-configmaptpl.component.html',
  styleUrls: ['create-edit-configmaptpl.scss']
})
export class CreateEditConfigMapTplComponent implements OnInit, AfterViewInit, OnDestroy {
  currentForm: FormGroup;
  configMapTpl: ConfigMapTpl = new ConfigMapTpl();
  checkOnGoing = false;
  isSubmitOnGoing = false;
  actionType: ActionType;
  app: App;
  configMap: ConfigMap;
  kubeConfigMap: KubeConfigMap = new KubeConfigMap();
  componentName = '配置集';
  clusters: Cluster[];

  top: number;
  box: HTMLElement;
  show = false;
  eventList: any = Array();

  constructor(private configMapTplService: ConfigMapTplService,
              private configMapService: ConfigMapService,
              private fb: FormBuilder,
              private aceEditorService: AceEditorService,
              public cacheService: CacheService,
              private clusterService: ClusterService,
              private location: Location,
              private router: Router,
              public authService: AuthService,
              private appService: AppService,
              private route: ActivatedRoute,
              private messageHandlerService: MessageHandlerService,
              @Inject(DOCUMENT) private document: any,
              private eventManager: EventManager) {
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

  get datas(): FormArray {
    return this.currentForm.get('datas') as FormArray;
  }

  initData() {
    return this.fb.group({
      dataName: '',
      dataValue: '',
    });
  }

  onAddData(index: number) {
    const datas = this.currentForm.get(`datas`) as FormArray;
    datas.push(this.initData());
  }

  onDeleteData(index: number) {
    if (this.datas.controls.length <= 1) {
      return;
    }
    this.datas.removeAt(index);
  }

  createForm() {
    let disabled = false;
    if (this.actionType === ActionType.EDIT) {
      disabled = true;
    }
    this.currentForm = this.fb.group({
      description: this.configMapTpl.description,
      datas: this.fb.array([
        this.fb.group({
          dataName: '',
          dataValue: '',
        })
      ]),
    });
  }

  initClusterGroups() {
    const clusters = Array<FormGroup>();
    this.clusters.forEach(cluster => {
      clusters.push(this.fb.group({
        checked: cluster.checked,
        name: cluster.name,
      }));
    });
    this.currentForm.setControl('clusters', this.fb.array(
      clusters
    ));

  }

  ngOnInit(): void {
    const appId = parseInt(this.route.parent.snapshot.params['id'], 10);
    const namespaceId = this.cacheService.namespaceId;
    const configMapId = parseInt(this.route.snapshot.params['configMapId'], 10);
    const tplId = parseInt(this.route.snapshot.params['tplId'], 10);
    const observables = Array(
      this.clusterService.getNames(),
      this.appService.getById(appId, namespaceId),
      this.configMapService.getById(configMapId, appId)
    );
    if (tplId) {
      this.actionType = ActionType.EDIT;
      observables.push(this.configMapTplService.getById(tplId, appId));
    } else {
      this.actionType = ActionType.ADD_NEW;
    }
    this.createForm();
    combineLatest(observables).subscribe(
      response => {
        const clusters = response[0].data;
        for (let i = 0; i < clusters.length; i++) {
          clusters[i].checked = false;
        }
        this.clusters = this.filterCluster(clusters);
        this.app = response[1].data;
        this.configMap = response[2].data;
        const tpl = response[3];
        if (tpl) {
          this.configMapTpl = tpl.data;
          this.saveConfigMapTpl(JSON.parse(this.configMapTpl.template));
          if (this.configMapTpl.metaData) {
            const configedClusters = JSON.parse(this.configMapTpl.metaData).clusters;
            for (const cluster of configedClusters) {
              for (let i = 0; i < this.clusters.length; i++) {
                if (cluster === this.clusters[i].name) {
                  this.clusters[i].checked = true;
                }
              }
            }
          }
        }
        this.initClusterGroups();
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
  }

  filterCluster(clusters: Cluster[]): Cluster[] {
    return clusters.filter((clusterObj: Cluster) => {
      return this.cacheService.namespace.metaDataObj.clusterMeta &&
        this.cacheService.namespace.metaDataObj.clusterMeta[clusterObj.name];
    });
  }

  onCancel() {
    this.currentForm.reset();
    this.location.back();
  }

  onSubmit() {
    if (this.isSubmitOnGoing) {
      return;
    }
    this.isSubmitOnGoing = true;

    const metaDataStr = this.configMapTpl.metaData ? this.configMapTpl.metaData : '{}';
    const clusters = Array<string>();
    this.currentForm.controls.clusters.value.map((cluster: Cluster) => {
      if (cluster.checked) {
        clusters.push(cluster.name);
      }
    });
    const metaData = JSON.parse(metaDataStr);
    metaData['clusters'] = clusters;
    this.configMapTpl.metaData = JSON.stringify(metaData);
    const kubeConfigMap = this.getKubeConfigMapByForm();
    this.configMapTpl.template = JSON.stringify(kubeConfigMap);
    this.configMapTpl.id = undefined;
    this.configMapTpl.createTime = this.configMapTpl.updateTime = new Date();
    this.configMapTplService.create(this.configMapTpl, this.app.id).subscribe(
      status => {
        this.isSubmitOnGoing = false;
        this.messageHandlerService.showSuccess('创建' + this.componentName + '模版成功！');
        this.router.navigate([`portal/namespace/${this.cacheService.namespaceId}/app/${this.app.id}/configmap/${this.configMap.id}`]);
      },
      error => {
        this.isSubmitOnGoing = false;
        this.messageHandlerService.handleError(error);
      }
    );
  }

  public get isValid(): boolean {
    return this.currentForm &&
      this.currentForm.valid &&
      !this.isSubmitOnGoing &&
      !this.checkOnGoing;
  }

  buildLabels(labels: {}) {
    if (!labels) {
      labels = {};
    }
    labels[this.authService.config[appLabelKey]] = this.app.name;
    labels[this.authService.config[namespaceLabelKey]] = this.cacheService.currentNamespace.name;
    labels['app'] = this.configMap.name;
    return labels;
  }

  getKubeConfigMapByForm() {
    const formValue = this.currentForm.value;
    this.configMapTpl.description = formValue.description;
    this.configMapTpl.name = this.configMap.name;
    this.configMapTpl.configMapId = this.configMap.id;

    const kubeConfigMap = this.kubeConfigMap;
    if (!kubeConfigMap.metadata) {
      kubeConfigMap.metadata = new ObjectMeta();
    }
    kubeConfigMap.metadata.name = this.configMap.name;
    kubeConfigMap.metadata.labels = this.buildLabels(kubeConfigMap.metadata.labels);
    if (formValue.datas && formValue.datas.length > 0) {
      kubeConfigMap.data = {};
      for (const data of formValue.datas) {
        kubeConfigMap.data[data.dataName] = data.dataValue;
      }
    }
    return kubeConfigMap;
  }

  openModal(): void {
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(this.getKubeConfigMapByForm(), true));
  }

  saveConfigMapTpl(kubeConfigMap: KubeConfigMap) {
    this.removeUnused(kubeConfigMap);
    if (kubeConfigMap && kubeConfigMap.data) {
      this.kubeConfigMap = kubeConfigMap;
      const datas = Array<FormGroup>();
      Object.getOwnPropertyNames(kubeConfigMap.data).map(key => {
        datas.push(this.fb.group({
          dataName: key,
          dataValue: kubeConfigMap.data[key],
        }));
      });
      this.currentForm.setControl('datas', this.fb.array(datas));
    }
  }

  // remove unused fields, deal with user advanced mode paste yaml/json manually
  removeUnused(obj: any) {
    const metaData = new ObjectMeta();
    metaData.name = obj.metadata.name;
    metaData.namespace = obj.metadata.namespace;
    metaData.labels = obj.metadata.labels;
    metaData.annotations = obj.metadata.annotations;
    obj.metadata = metaData;
    obj.status = undefined;
  }
}

