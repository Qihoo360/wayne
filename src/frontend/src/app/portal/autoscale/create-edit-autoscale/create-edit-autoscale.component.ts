import { Component, OnInit } from '@angular/core';
import { MessageHandlerService } from '../../../shared/message-handler/message-handler.service';
import { AuthService } from '../../../shared/auth/auth.service';
import { CreateEditResource } from '../../../shared/base/resource/create-edit-resource';
import { AutoscaleService } from '../../../shared/client/v1/autoscale.service';
import { Autoscale } from '../../../shared/model/v1/autoscale';

@Component({
  selector: 'wayne-create-edit-autoscale',
  templateUrl: './create-edit-autoscale.component.html',
  styleUrls: ['./create-edit-autoscale.component.scss']
})
export class CreateEditAutoscaleComponent extends CreateEditResource implements OnInit {
  constructor(public autoscaleService: AutoscaleService,
              public authService: AuthService,
              public messageHandlerService: MessageHandlerService) {
    super(autoscaleService, authService, messageHandlerService);
    super.registResourceType('Autoscale');
    super.registResource(new Autoscale());
  }

  ngOnInit(): void {

  }
}
