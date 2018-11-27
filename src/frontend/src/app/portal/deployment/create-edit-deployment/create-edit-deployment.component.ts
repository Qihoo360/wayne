import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import {NgForm} from '@angular/forms';
import {MessageHandlerService} from '../../../shared/message-handler/message-handler.service';
import {ActionType, configKeyApiNameGenerateRule, defaultResources} from '../../../shared/shared.const';
import 'rxjs/add/observable/combineLatest';
import {Cluster} from '../../../shared/model/v1/cluster';
import {Resources} from '../../../shared/model/v1/resources-limit';
import {ClusterMeta, Deployment} from '../../../shared/model/v1/deployment';
import {DeploymentService} from '../../../shared/client/v1/deployment.service';
import {App} from '../../../shared/model/v1/app';
import {AuthService} from '../../../shared/auth/auth.service';
import {ApiNameGenerateRule} from '../../../shared/utils';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'create-edit-deployment',
  templateUrl: 'create-edit-deployment.component.html',
  styleUrls: ['create-edit-deployment.scss']
})

export class CreateEditDeploymentComponent implements OnInit {
  deploymentForm: NgForm;
  @ViewChild('deploymentForm')
  currentForm: NgForm;
  clusters: Cluster[];
  clusterMetas: {};
  resourcesMetas = new Resources();
  title: string;
  deployment: Deployment = new Deployment();
  checkOnGoing: boolean = false;
  isSubmitOnGoing: boolean = false;
  isNameValid: boolean = true;
  actionType: ActionType;
  modalOpened: boolean;
  app: App;
  isMaster:boolean = false;

  @Output() create = new EventEmitter<number>();

  constructor(private deploymentService: DeploymentService,
              public authService: AuthService,
              public translate: TranslateService,
              private messageHandlerService: MessageHandlerService) {
  }

  newOrEditDeployment(app: App, clusters: Cluster[], id?: number) {
    this.modalOpened = true;
    this.app = app;
    this.isNameValid = true;
    this.clusters = clusters;
    this.clusterMetas = {};
    if (this.clusters && this.clusters.length > 0) {
      for (let clu of this.clusters) {
        this.clusterMetas[clu.name] = new ClusterMeta(false);
      }
    }
    if (id) {
      this.actionType = ActionType.EDIT;
      this.title = '编辑部署';
      this.deploymentService.getById(id, app.id).subscribe(
        status => {
          this.deployment = status.data;
          let metaData = JSON.parse(this.deployment.metaData);
          if (this.clusters && this.clusters.length > 0) {
            let replicas = metaData['replicas'];
            for (let clu of this.clusters) {
              let culsterMeta = new ClusterMeta(false);
              if (replicas && replicas[clu.name]) {
                culsterMeta.checked = true;
                culsterMeta.value = replicas[clu.name];
              }
              this.clusterMetas[clu.name] = culsterMeta;
            }
          }
          if ('resources' in metaData) {
            for (let limit in metaData.resources) {
                metaData.resources[limit] = /Percent$/.test(limit) ? parseFloat(metaData.resources[limit].replace(/%$/, '')) : parseFloat(metaData.resources[limit]);
            }
            this.resourcesMetas = metaData.resources;
          }
        },
        error => {
          this.messageHandlerService.handleError(error);
        });
    } else {
      this.actionType = ActionType.ADD_NEW;
      this.title = '创建部署';
      this.deployment = new Deployment();
      this.resourcesMetas = Object.assign({}, defaultResources);
      this.deployment.metaData = '{}';
    }
  }

  get replicaLimit(): number {
    let replicaLimit = defaultResources.replicaLimit;
    if (this.deployment && this.deployment.metaData) {
      let metaData = JSON.parse(this.deployment.metaData);
      if (metaData.resources &&
        metaData.resources.replicaLimit) {
        replicaLimit = parseInt(metaData.resources.replicaLimit)
      }
    }
    if (this.resourcesMetas.replicaLimit !== null && this.resourcesMetas.replicaLimit !== undefined) {
      replicaLimit = this.resourcesMetas.replicaLimit;
    }
    return replicaLimit
  }

  replicaValidation(cluster: string): boolean {
    let clusterMeta = this.clusterMetas[cluster];
    if (this.deployment && this.deployment.metaData && clusterMeta) {
      if (!clusterMeta.checked) {
        return true
      }
      return parseInt(clusterMeta.value) <= this.replicaLimit
    }
    return false;
  }

  resourcesValidation(resource: string): boolean {
    let value = this.resourcesMetas[resource];
    if (/Percent$/.test(resource) && value !== null) {
      if (value <= 0 || value > 100) {
        return false;
      }
    }
    return true;
  }

  ngOnInit(): void {

  }


  onCancel() {
    this.modalOpened = false;
    this.currentForm.reset();
  }

  formatMetaData() {
    if (!this.deployment.metaData) {
      this.deployment.metaData = '{}';
    }
    let metaData = JSON.parse(this.deployment.metaData);
    let replicas = {};
    let resources = {};
    for (let clu of this.clusters) {
      let clusterMeta = this.clusterMetas[clu.name];
      if (clusterMeta && clusterMeta.checked && clusterMeta.value) {
        replicas[clu.name] = clusterMeta.value;
      }
    }
    for (let resource in this.resourcesMetas) {
      if (this.resourcesMetas[resource] !== null) resources[resource] = /Percent$/.test(resource) ? this.resourcesMetas[resource] + '%' : this.resourcesMetas[resource].toString();
    }
    metaData.replicas = replicas;
    if (Object.keys(resources).length) metaData.resources = resources;
      else delete metaData.resources;
    return JSON.stringify(metaData);
  }

  get nameGenerateRuleConfig():string{
    return ApiNameGenerateRule.config(
      this.authService.config[configKeyApiNameGenerateRule], this.app.metaData)
  }

  onSubmit() {
    if (this.isSubmitOnGoing) {
      return;
    }
    this.isSubmitOnGoing = true;
    this.deployment.appId = this.app.id;
    this.deployment.metaData = this.formatMetaData();
    switch (this.actionType) {
      case ActionType.ADD_NEW:
        this.deployment.name = ApiNameGenerateRule.generateName(ApiNameGenerateRule.config(
          this.authService.config[configKeyApiNameGenerateRule], this.app.metaData),
          this.deployment.name, this.app.name);
        this.deploymentService.create(this.deployment).subscribe(
          response => {
            this.messageHandlerService.showSuccess('创建部署成功！');
            this.create.emit(response.data.id);
          },
          error => {
            this.messageHandlerService.handleError(error);

          }
        );
        break;
      case ActionType.EDIT:
        this.deploymentService.update(this.deployment).subscribe(
          response => {
            this.messageHandlerService.showSuccess('更新部署成功！');
            this.create.emit(this.deployment.id);
          },
          error => {
            this.messageHandlerService.handleError(error);

          }
        );
        break;
    }
    this.isSubmitOnGoing = false;
    this.modalOpened = false;
  }

  public get isValid(): boolean {
    return this.currentForm &&
      this.currentForm.valid &&
      !this.isSubmitOnGoing &&
      this.isNameValid &&
      !this.checkOnGoing &&
      this.isClusterValid() &&
      this.isClusterReplicaValid() &&
      this.isResourcesValid();
  }

  isResourcesValid(): boolean {
    for (let resource in this.resourcesMetas) {
      let value = this.resourcesMetas[resource];
      if (/Percent$/.test(resource) && value !== null) {
        if (value <= 0 || value > 100) {
          return false
        }
      }
    }
    return true
  }

  isClusterValid(): boolean {
    if (this.clusters) {
      for (let clu of this.clusters) {
        let clusterMeta = this.clusterMetas[clu.name];
        if (clusterMeta && clusterMeta.checked && clusterMeta.value) {
          return true;
        }
      }
    }
    return false;
  }

  isClusterReplicaValid(): boolean {
    if (this.clusters) {
      for (let clu of this.clusters) {
        if (!this.replicaValidation(clu.name)) {
          return false
        }
      }
    }
    return true;
  }

  

//Handle the form validation
  handleValidation(): void {
    let cont = this.currentForm.controls['deployment_name'];
    if (cont) {
      this.isNameValid = cont.valid
    }

  }
}


