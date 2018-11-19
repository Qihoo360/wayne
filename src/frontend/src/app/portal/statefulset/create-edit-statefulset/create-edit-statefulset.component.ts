import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import {NgForm} from '@angular/forms';
import {MessageHandlerService} from '../../../shared/message-handler/message-handler.service';
import {ActionType, configKeyApiNameGenerateRule, defaultResources} from '../../../shared/shared.const';
import 'rxjs/add/observable/combineLatest';
import {Cluster, ClusterMeta} from '../../../shared/model/v1/cluster';
import {StatefulsetService} from '../../../shared/client/v1/statefulset.service';
import {App} from '../../../shared/model/v1/app';
import {Statefulset} from '../../../shared/model/v1/statefulset';
import {AuthService} from '../../../shared/auth/auth.service';
import {ApiNameGenerateRule} from '../../../shared/utils';

@Component({
  selector: 'create-edit-statefulset',
  templateUrl: 'create-edit-statefulset.component.html',
  styleUrls: ['create-edit-statefulset.scss']
})

export class CreateEditStatefulsetComponent implements OnInit {
  ngForm: NgForm;
  @ViewChild('ngForm')
  currentForm: NgForm;
  clusters: Cluster[];
  clusterMetas: {};
  title: string;
  statefulset: Statefulset = new Statefulset();
  checkOnGoing: boolean = false;
  isSubmitOnGoing: boolean = false;
  isNameValid: boolean = true;
  actionType: ActionType;
  modalOpened: boolean;
  app: App;

  @Output() create = new EventEmitter<number>();

  constructor(private statefulsetService: StatefulsetService,
              private authService: AuthService,
              private messageHandlerService: MessageHandlerService) {
  }

  newOrEdit(app: App, clusters: Cluster[], id?: number) {
    this.modalOpened = true;
    this.app = app;
    this.isNameValid = true;
    this.currentForm.reset();
    this.clusters = clusters;
    this.clusterMetas = {};
    if (this.clusters && this.clusters.length > 0) {
      for (let clu of this.clusters) {
        this.clusterMetas[clu.name] = new ClusterMeta(false);
      }
    }
    if (id) {
      this.actionType = ActionType.EDIT;
      this.title = '编辑状态副本集';
      this.statefulsetService.getById(id, app.id).subscribe(
        status => {
          this.statefulset = status.data;
          if (this.clusters && this.clusters.length > 0) {
            let replicas = JSON.parse(this.statefulset.metaData)['replicas'];
            for (let clu of this.clusters) {
              let culsterMeta = new ClusterMeta(false);
              if (replicas && replicas[clu.name]) {
                culsterMeta.checked = true;
                culsterMeta.value = replicas[clu.name];
              }
              this.clusterMetas[clu.name] = culsterMeta;
            }
          }
        },
        error => {
          this.messageHandlerService.handleError(error);
        });
    } else {
      this.actionType = ActionType.ADD_NEW;
      this.title = '创建状态副本集';
      this.statefulset = new Statefulset();
      this.statefulset.metaData = '{}';
    }
  }

  get replicaLimit(): number {
    let replicaLimit = defaultResources.replicaLimit;
    if (this.statefulset && this.statefulset.metaData) {
      let metaData = JSON.parse(this.statefulset.metaData);
      if (metaData.resources &&
        metaData.resources.replicaLimit) {
        replicaLimit = parseInt(metaData.resources.replicaLimit)
      }
    }
    return replicaLimit
  }

  replicaValidation(cluster: string): boolean {
    let clusterMeta = this.clusterMetas[cluster];
    if (this.statefulset && this.statefulset.metaData && clusterMeta) {
      if (!clusterMeta.checked) {
        return true
      }
      return parseInt(clusterMeta.value) <= this.replicaLimit
    }
    return false;
  }

  ngOnInit(): void {

  }


  onCancel() {
    this.modalOpened = false;
    this.currentForm.reset();
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
    this.statefulset.appId = this.app.id;

    let replicas = {};
    for (let clu of this.clusters) {
      let clusterMeta = this.clusterMetas[clu.name];
      if (clusterMeta && clusterMeta.checked && clusterMeta.value) {
        replicas[clu.name] = clusterMeta.value;
      }
    }
    if (!this.statefulset.metaData) {
      this.statefulset.metaData = '{}';
    }
    let metaData = JSON.parse(this.statefulset.metaData);
    metaData.replicas = replicas;
    this.statefulset.metaData = JSON.stringify(metaData);
    switch (this.actionType) {
      case ActionType.ADD_NEW:
        this.statefulset.name = ApiNameGenerateRule.generateName(ApiNameGenerateRule.config(
          this.authService.config[configKeyApiNameGenerateRule], this.app.metaData),
          this.statefulset.name, this.app.name);
        this.statefulsetService.create(this.statefulset).subscribe(
          response => {
            this.messageHandlerService.showSuccess('创建状态副本集成功！');
            this.create.emit(response.data.id);
          },
          error => {
            this.messageHandlerService.handleError(error);

          }
        );
        break;
      case ActionType.EDIT:
        this.statefulsetService.update(this.statefulset).subscribe(
          response => {
            this.messageHandlerService.showSuccess('更新状态副本集成功！');
            this.create.emit(this.statefulset.id);
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
      this.isClusterReplicaValid();
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
    let cont = this.currentForm.controls['statefulset_name'];
    if (cont) {
      this.isNameValid = cont.valid
    }

  }
}


