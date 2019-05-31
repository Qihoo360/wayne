import { AfterViewInit, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { DOCUMENT, Location } from '@angular/common';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { ActionType, appLabelKey, namespaceLabelKey } from '../../../shared/shared.const';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { EventManager } from '@angular/platform-browser';
import { SecretTpl } from '../../../shared/model/v1/secrettpl';
import { App } from '../../../shared/model/v1/app';
import { Secret } from '../../../shared/model/v1/secret';
import { KubeSecret, ObjectMeta } from '../../../shared/model/v1/kubernetes/secret';
import { SecretTplService } from '../../../shared/client/v1/secrettpl.service';
import { SecretService } from '../../../shared/client/v1/secret.service';
import { AppService } from '../../../shared/client/v1/app.service';
import { Cluster } from '../../../shared/model/v1/cluster';
import { ClusterService } from '../../../shared/client/v1/cluster.service';
import { CacheService } from '../../../shared/auth/cache.service';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { AceEditorMsg } from '../../../shared/ace-editor/ace-editor';
import { AuthService } from '../../../shared/auth/auth.service';
import { Base64 } from 'js-base64';

@Component({
  selector: 'create-edit-secrettpl',
  templateUrl: 'create-edit-secrettpl.component.html',
  styleUrls: ['create-edit-secrettpl.scss']
})
export class CreateEditSecretTplComponent implements OnInit, AfterViewInit, OnDestroy {
  currentForm: FormGroup;

  secretTpl: SecretTpl = new SecretTpl();
  checkOnGoing = false;
  isSubmitOnGoing = false;
  actionType: ActionType;
  app: App;
  secret: Secret;
  top: number;
  box: HTMLElement;
  kubeSecret: KubeSecret = new KubeSecret();
  componentName = '加密字典';
  clusters: Cluster[];
  eventList: any[] = Array();

  constructor(private secretTplService: SecretTplService,
              private secretService: SecretService,
              private fb: FormBuilder,
              private aceEditorService: AceEditorService,
              public cacheService: CacheService,
              private location: Location,
              private clusterService: ClusterService,
              private router: Router,
              private appService: AppService,
              public authService: AuthService,
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
      type: 'Opaque',
      description: this.secretTpl.description,
      datas: this.fb.array([
        this.fb.group({
          dataName: '',
          dataValue: '',
        })
      ])
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
    const secretId = parseInt(this.route.snapshot.params['secretId'], 10);
    const tplId = parseInt(this.route.snapshot.params['tplId'], 10);
    const observables = Array(
      this.clusterService.getNames(),
      this.appService.getById(appId, namespaceId),
      this.secretService.getById(secretId, appId)
    );
    if (tplId) {
      this.actionType = ActionType.EDIT;
      observables.push(this.secretTplService.getById(tplId, appId));
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
        this.secret = response[2].data;
        const tpl = response[3];
        if (tpl) {
          this.secretTpl = tpl.data;
          this.saveSecretTpl(JSON.parse(this.secretTpl.template));
          if (this.secretTpl.metaData) {
            const configedClusters = JSON.parse(this.secretTpl.metaData).clusters;
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
    const metaDataStr = this.secretTpl.metaData ? this.secretTpl.metaData : '{}';
    const clusters = Array<string>();
    this.currentForm.controls.clusters.value.map((cluster: Cluster) => {
      if (cluster.checked) {
        clusters.push(cluster.name);
      }
    });
    const metaData = JSON.parse(metaDataStr);
    metaData['clusters'] = clusters;
    this.secretTpl.metaData = JSON.stringify(metaData);

    const kubeSecret = this.getKubeSecretByForm();
    this.secretTpl.template = JSON.stringify(kubeSecret);
    this.secretTpl.id = undefined;
    this.secretTpl.createTime = this.secretTpl.updateTime = new Date();
    this.secretTplService.create(this.secretTpl, this.app.id).subscribe(
      status => {
        this.isSubmitOnGoing = false;
        this.messageHandlerService.showSuccess('创建' + this.componentName + '模版成功！');
        this.router.navigate([`portal/namespace/${this.cacheService.namespaceId}/app/${this.app.id}/secret/${this.secret.id}`]);
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
    labels['app'] = this.secret.name;
    return labels;
  }

  getKubeSecretByForm() {
    const formValue = this.currentForm.value;
    this.secretTpl.description = formValue.description;
    this.secretTpl.name = this.secret.name;
    this.secretTpl.secretId = this.secret.id;

    const kubeSecret = this.kubeSecret;
    if (!kubeSecret.metadata) {
      kubeSecret.metadata = new ObjectMeta();
    }
    kubeSecret.kind = 'Secret';
    kubeSecret.apiVersion = 'v1';
    kubeSecret.type = formValue.type;
    kubeSecret.metadata.name = this.secret.name;
    kubeSecret.metadata.labels = this.buildLabels(kubeSecret.metadata.labels);
    if (formValue.datas && formValue.datas.length > 0) {
      kubeSecret.data = {};
      for (const data of formValue.datas) {
        kubeSecret.data[data.dataName] = Base64.encode(data.dataValue);
      }
    }
    return kubeSecret;
  }

  openModal(): void {
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(this.getKubeSecretByForm(), true));
  }

  saveSecretTpl(kubeSecret: KubeSecret) {
    this.removeUnused(kubeSecret);
    if (kubeSecret && kubeSecret.data) {
      this.kubeSecret = kubeSecret;
      const datas = Array<FormGroup>();
      Object.getOwnPropertyNames(kubeSecret.data).map(key => {
        datas.push(this.fb.group({
          dataName: key,
          dataValue: Base64.decode(kubeSecret.data[key]),
        }));
      });
      this.currentForm.setControl('type', this.fb.control(this.kubeSecret.type));
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

