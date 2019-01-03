import { NgModule } from '@angular/core';
import { PodTerminalComponent } from './pod-terminal.component';
import { SharedModule } from '../../shared/shared.module';
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
