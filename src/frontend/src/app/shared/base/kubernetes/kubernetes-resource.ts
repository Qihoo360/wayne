import { MessageHandlerService } from '../../message-handler/message-handler.service';
import { Subscription } from 'rxjs/Subscription';
import { ConfirmationDialogService } from '../../confirmation-dialog/confirmation-dialog.service';
import { AceEditorComponent } from '../../ace-editor/ace-editor.component';
import { AuthService } from '../../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ClusterService } from '../../client/v1/cluster.service';

export class KubernetesResource {
  listResourceComponent: any;
  aceEditorModal: AceEditorComponent;

  showState: object;

  cluster: string;
  clusters: Array<any>;
  resourceName: string;
  resources: Array<any>;
  showList: any[] = new Array();

  subscription: Subscription;
  resourceType: string;

  constructor(public resourceClient: any,
              public route: ActivatedRoute,
              public router: Router,
              public clusterService: ClusterService,
              public authService: AuthService,
              public messageHandlerService: MessageHandlerService,
              public deletionDialogService: ConfirmationDialogService) {
  }

  registResourceType(resourceType: string) {
    this.resourceType = resourceType;
  }

  registShowSate(state: Object) {
    this.showState = state;
  }

  onConfirmEvent() {
    Object.keys(this.showState).forEach(key => {
      if (this.showList.indexOf(key) > -1) {
        this.showState[key] = {hidden: false};
      } else {
        this.showState[key] = {hidden: true};
      }
    });
  }

  onCancelEvent() {
    this.initShow();
  }

  initShow() {
    this.showList = [];
    Object.keys(this.showState).forEach(key => {
      if (!this.showState[key].hidden) {
        this.showList.push(key);
      }
    });
  }

  refresh(refresh: boolean) {
    if (refresh) {
      this.retrieveResource();
    }
  }

  retrieveResource(): void {
    if (this.cluster) {
      this.resourceClient.list(this.cluster)
        .subscribe(
          response => {
            this.resources = response.data;
          },
          error => this.messageHandlerService.handleError(error)
        );
    }
  }


  onEditResourceEvent(resource: any) {
  }

  onSaveResourceEvent(resource: any) {

  }

  onDeleteResourceEvent(resource: any) {
  }

  jumpToHref(cluster) {
    this.cluster = cluster;
    this.router.navigateByUrl(`admin/kubernetes/${this.resourceType}/${cluster}`);
    this.retrieveResource();
  }
}
