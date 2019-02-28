import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import 'rxjs/add/observable/combineLatest';
import { Ingress } from '../../../shared/model/v1/ingress';
import { IngressService } from '../../../shared/client/v1/ingress.service';
import { AuthService } from '../../../shared/auth/auth.service';
import { CreateEditResource } from '../../../shared/base/resource/create-edit-resource';

@Component({
  selector: 'create-edit-ingress',
  templateUrl: 'create-edit-ingress.component.html',
  styleUrls: ['create-edit-ingress.scss']
})

export class CreateEditIngressComponent extends CreateEditResource implements OnInit {
  constructor(public ingressService: IngressService,
              public authService: AuthService,
              public messageHandlerService: MessageHandlerService) {
    super(ingressService, authService, messageHandlerService);
    super.registResourceType('Ingress');
    super.registResource(new Ingress());
  }

  ngOnInit(): void {
  }
}


