import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import {NgForm} from '@angular/forms';
import {MessageHandlerService} from '../../../shared/message-handler/message-handler.service';
import {ActionType, configKeyApiNameGenerateRule, defaultResources} from '../../../shared/shared.const';
import 'rxjs/add/observable/combineLatest';
import {Cluster} from '../../../shared/model/v1/cluster';
import {Resources} from '../../../shared/model/v1/resources-limit';
import {Ingress} from '../../../shared/model/v1/ingress';
import {IngressService} from '../../../shared/client/v1/ingress.service';
import {App} from '../../../shared/model/v1/app';
import {AuthService} from '../../../shared/auth/auth.service';
import {ApiNameGenerateRule} from '../../../shared/utils';

@Component({
  selector: 'create-edit-ingress',
  templateUrl: 'create-edit-ingress.component.html',
  styleUrls: ['create-edit-ingress.scss']
})

export class CreateEditIngressComponent implements OnInit {
  ngForm: NgForm;
  @ViewChild('ngForm')
  currentForm: NgForm;
  clusters: Cluster[];
  clusterMetas: {};
  resourcesMetas = new Resources();
  title: string;
  ingress: Ingress = new Ingress();
  checkOnGoing: boolean = false;
  isSubmitOnGoing: boolean = false;
  isNameValid: boolean = true;
  actionType: ActionType;
  modalOpened: boolean;
  app: App;
  isMaster:boolean = false;

  @Output() create = new EventEmitter<number>();

  constructor(private ingressService: IngressService,
              public authService: AuthService,
              private messageHandlerService: MessageHandlerService) {
  }

  newOrEditIngress(app: App, clusters: Cluster[], id?: number) {
    this.modalOpened = true;
    this.app = app;
    this.isNameValid = true;
    this.clusters = clusters;
    this.clusterMetas = {};
    if (id) {
      this.actionType = ActionType.EDIT;
      this.title = '编辑 Ingress';
      this.ingressService.getById(id, app.id).subscribe(
        status => {
          this.ingress = status.data;
        },
        error => {
          this.messageHandlerService.handleError(error);
        });
    } else {
      this.actionType = ActionType.ADD_NEW;
      this.title = '创建 Ingress';
      this.ingress = new Ingress();
      this.resourcesMetas = Object.assign({}, defaultResources);
      this.ingress.metaData = '{}';
    }
  }

  replicaValidation(cluster: string): boolean {
    return true;
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

  get nameGenerateRuleConfig(): string {
    return ApiNameGenerateRule.config(
      this.authService.config[configKeyApiNameGenerateRule], this.app.metaData)
  }

  onSubmit() {
    if (this.isSubmitOnGoing) {
      return;
    }
    this.isSubmitOnGoing = true;
    this.ingress.appId = this.app.id;
    let metaData = JSON.parse(this.ingress.metaData);
    let checkedCluster = Array<string>();
    this.clusters.map(cluster => {
      if (cluster.checked) {
        checkedCluster.push(cluster.name)
      }
    });
    metaData['clusters'] = checkedCluster;
    this.ingress.metaData = JSON.stringify(metaData);
    switch (this.actionType) {
      case ActionType.ADD_NEW:
        this.ingress.name = ApiNameGenerateRule.generateName(ApiNameGenerateRule.config(
          this.authService.config[configKeyApiNameGenerateRule], this.app.metaData),
          this.ingress.name, this.app.name);
        this.ingressService.create(this.ingress).subscribe(
          response => {
            this.messageHandlerService.showSuccess('创建 ingress 成功！');
            this.create.emit(response.data.id);
          },
          error => {
            this.messageHandlerService.handleError(error);

          }
        );
        break;
      case ActionType.EDIT:
        this.ingressService.update(this.ingress).subscribe(
          response => {
            this.messageHandlerService.showSuccess('更新 ingress 成功！');
            this.create.emit(this.ingress.id);
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
      !this.checkOnGoing
  }

  handleValidation(): void {
    let cont = this.currentForm.controls['name'];
    if (cont) {
      this.isNameValid = cont.valid
    }
  }
}


