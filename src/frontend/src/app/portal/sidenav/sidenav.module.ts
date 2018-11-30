import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { SidenavComponent } from './sidenav.component';
import { FooterModule } from '../../shared/footer/footer.module';

@NgModule({
  imports: [
    SharedModule,
    RouterModule,
    FooterModule
  ],
  providers: [],
  exports: [SidenavComponent],
  declarations: [
    SidenavComponent
  ]
})

export class SidenavModule {
}
