import { NgModule } from '@angular/core';
import { PodTerminalComponent } from './pod-terminal.component';
import { SharedModule } from 'wayne-component/lib/shared.module';
import { PodTerminalRoutingModule } from './pod-terminal-routing.module';

@NgModule({
  imports: [
    SharedModule,
    PodTerminalRoutingModule
  ],
  providers: [],
  declarations: [PodTerminalComponent]
})
export class PodTerminalModule {
}
