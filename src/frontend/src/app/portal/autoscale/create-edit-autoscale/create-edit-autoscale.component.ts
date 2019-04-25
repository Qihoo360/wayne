import { Component, OnInit } from '@angular/core';
import { MessageHandlerService } from 'wayne-component';
import { AuthService } from 'wayne-component/lib/auth/auth.service';
import { CreateEditResource } from 'wayne-component/lib/base/resource/create-edit-resource';
import { AutoscaleService } from 'wayne-component/lib/client/v1/autoscale.service';
import { Autoscale } from 'wayne-component/lib/model/v1/autoscale';

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
