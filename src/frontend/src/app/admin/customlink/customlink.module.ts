import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CustomlinkComponent } from './customlink.component';
import { ListCustomlinkComponent } from './list-customlink/list-customlink.component';
import { CreateEditCustomlinkComponent } from './create-edit-customlink/create-edit-customlink.component';
import { CustomlinkService } from '../../shared/client/v1/customlink.service';
@NgModule({
  imports: [SharedModule],
  providers: [
    CustomlinkService
  ],
  declarations: [CustomlinkComponent, ListCustomlinkComponent, CreateEditCustomlinkComponent]
})
export class CustomlinkModule {

}
