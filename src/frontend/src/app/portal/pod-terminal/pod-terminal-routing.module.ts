import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PodTerminalComponent } from './pod-terminal.component';


const routes: Routes = [
  {
    path: 'portal/namespace/:nid/app/:id/:resourceType/:resourceName/pod/:podName/terminal/:cluster/:namespace',
    component: PodTerminalComponent
  },
  {
    path: 'portal/namespace/:nid/app/:id/:resourceType/:resourceName/pod/:podName/container/:container/terminal/:cluster/:namespace',
    component: PodTerminalComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PodTerminalRoutingModule {
}
