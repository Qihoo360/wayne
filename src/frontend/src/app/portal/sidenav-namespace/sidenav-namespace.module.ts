import { NgModule } from '@angular/core';
import { SidenavNamespaceComponent } from './sidenav-namespace.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { FooterModule } from '../../shared/footer/footer.module';

@NgModule({
  imports: [
    SharedModule,
    RouterModule,
    FooterModule
  ],
  providers: [],
  exports: [SidenavNamespaceComponent],
  declarations: [
    SidenavNamespaceComponent
  ]
})

export class SidenavNamespaceModule {
}
