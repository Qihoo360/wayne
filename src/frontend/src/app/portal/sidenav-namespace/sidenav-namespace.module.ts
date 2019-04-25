import { NgModule } from '@angular/core';
import { SidenavNamespaceComponent } from './sidenav-namespace.component';
import { SharedModule } from 'wayne-component/lib/shared.module';
import { RouterModule } from '@angular/router';
import { FooterModule } from 'wayne-component/lib/footer/footer.module';

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
