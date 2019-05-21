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
import { App } from '../../../shared/model/v1/app';
import { AppService } from '../../../shared/client/v1/app.service';
import { CacheService } from '../../../shared/auth/cache.service';
import { Cluster } from '../../../shared/model/v1/cluster';
import { ClusterService } from '../../../shared/client/v1/cluster.service';
import { PersistentVolumeClaim } from '../../../shared/model/v1/persistentvolumeclaim';
import { PersistentVolumeClaimTpl } from '../../../shared/model/v1/persistentvolumeclaimtpl';
import { PersistentVolumeClaimTplService } from '../../../shared/client/v1/persistentvolumeclaimtpl.service';
import { PersistentVolumeClaimService } from '../../../shared/client/v1/persistentvolumeclaim.service';
import {
  KubePersistentVolumeClaim,
  LabelSelector,
  ObjectMeta,
  PersistentVolumeClaimSpec,
  ResourceRequirements
} from '../../../shared/model/v1/kubernetes/persistentvolumeclaim';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { AceEditorMsg } from '../../../shared/ace-editor/ace-editor';
import { AuthService } from '../../../shared/auth/auth.service';

@Component({
  selector: 'create-edit-persistentvolumeclaimtpl',
  templateUrl: 'create-edit-persistentvolumeclaimtpl.component.html',
  styleUrls: ['create-edit-persistentvolumeclaimtpl.scss']
})
export class CreateEditPersistentVolumeClaimTplComponent implements OnInit, AfterViewInit, OnDestroy {
  currentForm: FormGroup;
  pvcTpl: PersistentVolumeClaimTpl = new PersistentVolumeClaimTpl();
  checkOnGoing = false;
  isSubmitOnGoing = false;
  actionType: ActionType;
  app: App;
  top: number;
  box: HTMLElement;
  pvc: PersistentVolumeClaim;
  kubePvc: KubePersistentVolumeClaim;
  componentName = 'PVC';
  clusters: Cluster[];

  show = false;
  eventList: any[] = Array();

  constructor(private pvcTplService: PersistentVolumeClaimTplService,
              private pvcService: PersistentVolumeClaimService,
              private fb: FormBuilder,
              private clusterService: ClusterService,
              private location: Location,
              private router: Router,
              public authService: AuthService,
              private aceEditorService: AceEditorService,
              private appService: AppService,
              private route: ActivatedRoute,
              public cacheService: CacheService,
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

  get selectors(): FormArray {
    return this.currentForm.get('selectors') as FormArray;
  }

  onAddSelector() {
    const selectors = this.currentForm.get(`selectors`) as FormArray;
    selectors.push(this.initSelector());
  }

  onDeleteSelector(index: number) {
    this.selectors.removeAt(index);
  }

  initSelector() {
    return this.fb.group({
      key: '',
      value: '',
    });
  }

  createForm() {
    this.currentForm = this.fb.group({
      description: this.pvcTpl.description,
      storage: '',
      readWriteOnce: false,
      readOnlyMany: false,
      readWriteMany: false,
      selectors: this.fb.array([this.initSelector()])
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
    this.kubePvc = new KubePersistentVolumeClaim();

    const appId = parseInt(this.route.parent.snapshot.params['id'], 10);
    const namespaceId = this.cacheService.namespaceId;
    const pvcId = parseInt(this.route.snapshot.params['pvcId'], 10);
    const tplId = parseInt(this.route.snapshot.params['tplId'], 10);
    const observables = Array(
      this.clusterService.getNames(),
      this.appService.getById(appId, namespaceId),
      this.pvcService.getById(pvcId, appId)
    );
    if (tplId) {
      this.actionType = ActionType.EDIT;
      observables.push(this.pvcTplService.getById(tplId, appId));
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
        this.pvc = response[2].data;
        const tpl = response[3];
        if (tpl) {
          this.pvcTpl = tpl.data;
          this.pvcTpl.description = null;
          this.savePvcTpl(JSON.parse(this.pvcTpl.template));
          if (this.pvcTpl.metaData) {
            const configedClusters = JSON.parse(this.pvcTpl.metaData).clusters;
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

    const metaDataStr = this.pvcTpl.metaData ? this.pvcTpl.metaData : '{}';
    const clusters = Array<string>();
    this.currentForm.controls.clusters.value.map((cluster: Cluster) => {
      if (cluster.checked) {
        clusters.push(cluster.name);
      }
    });
    const metaData = JSON.parse(metaDataStr);
    metaData['clusters'] = clusters;
    this.pvcTpl.metaData = JSON.stringify(metaData);
    const kubePvc = this.getKubePvcByForm();
    this.pvcTpl.template = JSON.stringify(kubePvc);
    this.pvcTpl.id = undefined;
    this.pvcTplService.create(this.pvcTpl, this.app.id).subscribe(
      status => {
        this.isSubmitOnGoing = false;
        this.messageHandlerService.showSuccess('创建' + this.componentName + '模版成功！');
        this.router.navigate(
          [`portal/namespace/${this.cacheService.namespaceId}/app/${this.app.id}/persistentvolumeclaim/${this.pvc.id}/list`]);
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
      !this.checkOnGoing &&
      this.accessModesValid;
  }

  buildLabels(labels: {}) {
    if (!labels) {
      labels = {};
    }
    labels[this.authService.config[appLabelKey]] = this.app.name;
    labels[this.authService.config[namespaceLabelKey]] = this.cacheService.currentNamespace.name;
    labels['app'] = this.pvc.name;
    return labels;
  }

  get accessModesValid(): boolean {
    return this.currentForm.value.readWriteOnce || this.currentForm.value.readOnlyMany || this.currentForm.value.readWriteMany;
  }

  getKubePvcByForm() {
    const formValue = this.currentForm.value;
    this.pvcTpl.description = formValue.description;
    this.pvcTpl.name = this.pvc.name;
    this.pvcTpl.persistentVolumeClaimId = this.pvc.id;

    const kubePvc = this.kubePvc;
    if (!kubePvc.metadata) {
      kubePvc.metadata = new ObjectMeta();
    }
    kubePvc.metadata.name = this.pvc.name;
    kubePvc.metadata.labels = this.buildLabels(kubePvc.metadata.labels);
    if (!kubePvc.spec) {
      kubePvc.spec = new PersistentVolumeClaimSpec();
    }
    if (!kubePvc.spec.resources) {
      kubePvc.spec.resources = new ResourceRequirements();
    }
    kubePvc.spec.resources.requests = {'storage': formValue.storage + 'Gi'};
    const accessModes = Array<string>();
    if (formValue.readWriteOnce) {
      accessModes.push('ReadWriteOnce');
    }
    if (formValue.readOnlyMany) {
      accessModes.push('ReadOnlyMany');
    }
    if (formValue.readWriteMany) {
      accessModes.push('ReadWriteMany');
    }
    kubePvc.spec.accessModes = accessModes;
    if (formValue.selectors && formValue.selectors.length > 0) {
      if (!kubePvc.spec.selector) {
        kubePvc.spec.selector = new LabelSelector();
      }
      kubePvc.spec.selector.matchLabels = {};
      for (const selector of formValue.selectors) {
        kubePvc.spec.selector.matchLabels[selector.key] = selector.value;
      }
    }

    return kubePvc;
  }

  openModal(): void {
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(this.getKubePvcByForm(), true));
  }

  savePvcTpl(kubePvc: KubePersistentVolumeClaim) {
    this.removeUnused(kubePvc);
    if (kubePvc && kubePvc.spec) {
      this.kubePvc = kubePvc;
      let storage;
      if (kubePvc.spec.resources && kubePvc.spec.resources.requests) {
        storage = kubePvc.spec.resources.requests['storage'].replace('Gi', '');
      }
      let readWriteOnce = false;
      let readOnlyMany = false;
      let readWriteMany = false;
      if (kubePvc.spec.accessModes && kubePvc.spec.accessModes.length > 0) {
        kubePvc.spec.accessModes.map(key => {
          switch (key) {
            case 'ReadWriteOnce':
              readWriteOnce = true;
              break;
            case 'ReadOnlyMany':
              readOnlyMany = true;
              break;
            case 'ReadWriteMany':
              readWriteMany = true;
              break;
          }
        });
      }
      const selectors = Array<FormGroup>();
      if (kubePvc.spec.selector && kubePvc.spec.selector.matchLabels) {
        Object.getOwnPropertyNames(kubePvc.spec.selector.matchLabels).map(key => {
          selectors.push(this.fb.group({
            key: key,
            value: kubePvc.spec.selector.matchLabels[key]
          }));
        });
      }
      const clusters = this.currentForm.get('clusters');
      this.currentForm = this.fb.group({
        description: this.currentForm.get('description').value,
        storage: storage,
        readWriteOnce: readWriteOnce,
        readOnlyMany: readOnlyMany,
        readWriteMany: readWriteMany,
        selectors: this.fb.array(selectors)
      });
      this.currentForm.setControl('clusters', clusters);
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

