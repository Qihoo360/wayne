import {Component, OnInit, ViewChild} from '@angular/core';
import {Location} from '@angular/common';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import {NgForm} from '@angular/forms';
import {MessageHandlerService} from '../../../shared/message-handler/message-handler.service';
import {ActionType, appLabelKey, namespaceLabelKey} from '../../../shared/shared.const';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {App} from '../../../shared/model/v1/app';
import {AppService} from '../../../shared/client/v1/app.service';
import {CacheService} from '../../../shared/auth/cache.service';
import {AceEditorService} from '../../../shared/ace-editor/ace-editor.service';
import {AceEditorMsg} from '../../../shared/ace-editor/ace-editor';
import {defaultIngress} from '../../../shared/default-models/ingress.const';
import {mergeDeep} from '../../../shared/utils';
import {Ingress} from '../../../shared/model/v1/ingress';
import {IngressTpl} from '../../../shared/model/v1/ingresstpl';
import {IngressService} from '../../../shared/client/v1/ingress.service';
import {IngressTplService} from '../../../shared/client/v1/ingresstpl.service';
import {AuthService} from '../../../shared/auth/auth.service';
import {KubeIngress} from '../../../shared/model/v1/kubernetes/ingress';


@Component({
  selector: 'create-edit-ingresstpl',
  templateUrl: './create-edit-ingresstpl.component.html',
  styleUrls: ['./create-edit-ingresstpl.scss']
})
export class CreateEditIngressTplComponent implements OnInit {
  ngForm: NgForm;
  @ViewChild('ngForm')
  currentForm: NgForm;

  ingressTpl: IngressTpl = new IngressTpl();
  checkOnGoing: boolean = false;
  isSubmitOnGoing: boolean = false;
  actionType: ActionType;
  app: App;
  ingress: Ingress;
  kubeIngress: KubeIngress;

  labelSelector = [];
  headless: boolean;


  constructor(private ingressTplService: IngressTplService,
              private ingressService: IngressService,
              private location: Location,
              private router: Router,
              private appService: AppService,
              private route: ActivatedRoute,
              public authService: AuthService,
              public cacheService: CacheService,
              private aceEditorService: AceEditorService,
              private messageHandlerService: MessageHandlerService) {
  }


  get appLabelKey(): string {
    return this.authService.config[appLabelKey]
  }

  initDefault() {
    this.kubeIngress = JSON.parse(defaultIngress);
    // this.kubeService.spec.ports.push(this.defaultPort());
  }

  onAddPort() {
    // this.kubeService.spec.ports.push(this.defaultPort());
  }

  onDeletePort(index: number) {
    // this.kubeService.spec.ports.splice(index, 1);
  }

  onAddSelector() {
    this.labelSelector.push({'key': '', 'value': ''});
  }

  onDeleteSelector(index: number) {
    this.labelSelector.splice(index, 1);
  }

  parseLabelSelectors() {
    // if (this.kubeService.spec.selector) {
    //   this.labelSelector = [];
    //   Object.getOwnPropertyNames(this.kubeService.spec.selector).map(key => {
    //     this.labelSelector.push({'key': key, 'value': this.kubeService.spec.selector[key]});
    //   });
    // }
  }

  // defaultPort(): ServicePort {
  //   let port = new ServicePort();
  //   port.protocol = "TCP";
  //   return port;
  // }

  ngOnInit(): void {
    console.log('测试');
    this.initDefault();
    let appId = parseInt(this.route.parent.snapshot.params['id']);
    let namespaceId = this.cacheService.namespaceId;
    let ingressId = parseInt(this.route.snapshot.params['ingressId']);
    let tplId = parseInt(this.route.snapshot.params['tplId']);
    let observables = Array(
      this.appService.getById(appId, namespaceId),
      this.ingressService.getById(ingressId, appId),
    );
    if (tplId) {
      this.actionType = ActionType.EDIT;
      observables.push(this.ingressTplService.getById(tplId, appId));
    } else {
      this.actionType = ActionType.ADD_NEW;
    }
    Observable.combineLatest(observables).subscribe(
      response => {
        this.app = response[0].data;
        this.ingress = response[1].data;
        let tpl = response[2];
        if (tpl) {
          this.ingressTpl = tpl.data;
          this.ingressTpl.description = null;
          this.saveIngressTpl(JSON.parse(this.ingressTpl.template));
        } else {
          this.labelSelector.push({'key': 'app', 'value': this.app.name});
        }
      },
      error => {
        this.messageHandlerService.handleError(error);
      }
    );
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

    let newIngress = JSON.parse(JSON.stringify(this.kubeIngress));
    newIngress = this.generateIngress(newIngress);
    this.ingressTpl.ingressId = this.ingress.id;
    this.ingressTpl.template = JSON.stringify(newIngress);

    this.ingressTpl.id = undefined;
    this.ingressTpl.name = this.ingress.name;
    this.ingressTplService.create(this.ingressTpl, this.app.id).subscribe(
      status => {
        this.isSubmitOnGoing = false;
        this.messageHandlerService.showSuccess('创建 Ingress 模版成功！');
        this.router.navigate([`portal/namespace/${this.cacheService.namespaceId}/app/${this.app.id}/ingress/${this.ingress.id}`]);
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
    labels['app'] = this.ingress.name;
    return labels;
  }

  generateIngress(kubeIngress: KubeIngress): KubeIngress {
    // if (this.labelSelector && this.labelSelector.length > 0) {
    //   kubeIngress.spec.selector = {};
    //   for (let selector of this.labelSelector) {
    //     kubeService.spec.selector[selector.key] = selector.value;
    //   }
    // }
    // if (this.headless) {
    //   kubeService.spec.clusterIP = 'None';
    // } else {
    //   kubeService.spec.clusterIP = undefined;
    // }
    // if (kubeService.spec.ports && kubeService.spec.ports.length > 0) {
    //   for (let i = 0; i < kubeService.spec.ports.length; i++) {
    //     kubeService.spec.ports[i].name = this.ingress.name + '-' + kubeService.spec.ports[i].port;
    //   }
    // }
    //
    // kubeService.metadata.name = this.ingress.name;
    // kubeService.metadata.labels = this.buildLabels(this.kubeService.metadata.labels);
    return kubeIngress;
  }

  openModal(): void {
    // let copy = Object.assign({}, myObject).
    // but this wont work for nested objects. SO an alternative would be
    let newIngress = JSON.parse(JSON.stringify(this.kubeIngress));
    newIngress = this.generateIngress(newIngress);
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(newIngress, true));
  }

  saveIngressTpl(kubeIngress: KubeIngress) {
    this.fillDefault(kubeIngress);
  }

  fillDefault(kubeIngress: KubeIngress) {
    this.kubeIngress = mergeDeep(JSON.parse(defaultIngress), kubeIngress);
    // if (this.kubeIngress.spec.clusterIP === 'None') {
    //   this.headless = true;
    // }
    this.parseLabelSelectors();
  }


}

