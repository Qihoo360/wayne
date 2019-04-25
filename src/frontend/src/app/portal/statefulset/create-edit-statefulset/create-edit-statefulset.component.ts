import { Component } from '@angular/core';
import { MessageHandlerService } from 'wayne-component';
import 'rxjs/add/observable/combineLatest';
import { StatefulsetService } from 'wayne-component/lib/client/v1/statefulset.service';
import { Statefulset } from 'wayne-component/lib/model/v1/statefulset';
import { AuthService } from 'wayne-component/lib/auth/auth.service';
import { CreateEditLimitResource } from 'wayne-component/lib/base/resource/create-edit-limit-resource';

@Component({
  selector: 'create-edit-statefulset',
  templateUrl: 'create-edit-statefulset.component.html',
  styleUrls: ['create-edit-statefulset.scss']
})

export class CreateEditStatefulsetComponent extends CreateEditLimitResource {
  constructor(
    public statefulsetService: StatefulsetService,
    public authService: AuthService,
    public messageHandlerService: MessageHandlerService
  ) {
    super(statefulsetService, authService, messageHandlerService);
    this.registResource(new Statefulset);
    this.registResourceType('状态副本集');
  }
}


