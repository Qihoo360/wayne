import { NgModule } from '@angular/core';
import { SharedModule } from 'wayne-component/lib/shared.module';
import { RouterModule } from '@angular/router';
import { FooterModule } from 'wayne-component/lib/footer/footer.module';
import { SidenavModule } from '../sidenav/sidenav.module';
import { BaseComponent } from './base.component';
import { PublishHistoryModule } from '../common/publish-history/publish-history.module';
import { TplDetailModule } from 'wayne-component/lib/tpl-detail/tpl-detail.module';

@NgModule({
  imports: [
    SharedModule,
    RouterModule,
    FooterModule,
    SidenavModule,
    PublishHistoryModule,
    TplDetailModule,
  ],
  providers: [],
  exports: [BaseComponent],
  declarations: [BaseComponent
  ]
})

export class BaseAppModule {
}
