import { Component, Input, OnInit } from '@angular/core';
import { KubernetesClient } from 'wayne-component/lib/client/v1/kubernetes/kubernetes';
import { KubeResourceEndpoint } from 'wayne-component/lib/shared.const';

@Component({
  selector: 'service-detail',
  templateUrl: './service-dg-row-detail.component.html'
})


export class DgRowDetailComponent implements OnInit {
  @Input() obj: any;

  @Input() cluster: string;


  endpoint: any;

  constructor(private kubernetesClient: KubernetesClient) {

  }

  ngOnInit() {
    this.kubernetesClient.get(this.cluster, KubeResourceEndpoint, this.obj.metadata.name, this.obj.metadata.namespace).subscribe(
      resp => {
        this.endpoint = resp.data;
      },
      error => {
        // this.messageHandlerService.handleError(error);
      }
    );
    // Make the server call

  }
}
