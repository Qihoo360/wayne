import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidenavComponent } from './sidenav.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    RouterModule
  ],
  providers: [],
  exports: [SidenavComponent],
  declarations: [SidenavComponent]
})

export class SidenavModule {
}
