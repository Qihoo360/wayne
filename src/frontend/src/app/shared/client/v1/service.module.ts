import { NgModule } from '@angular/core';
import { TipDirective } from './tip.directive';
import { PublishService } from './publish.service';
import { StorageService } from './storage.service';
import { TipService } from './tip.service';
import { ScrollBarService } from './scrollBar.service';
import { CopyService } from './copy.service';
import { TabDragService } from './tab-drag.service';
import { SelectCopyService } from './select-copy.service';
import { SideNavService } from './sidenav.service';
@NgModule({
  declarations: [TipDirective],
  exports: [TipDirective],
  providers: [
    PublishService,
    StorageService,
    TipService,
    ScrollBarService,
    CopyService,
    TabDragService,
    SelectCopyService,
    SideNavService
  ]
})
export class ServiceModule { }
