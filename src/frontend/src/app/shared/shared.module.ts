import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PageNotFoundModule } from './not-found/not-found.module';
import { MessageModule, MessageService } from './global-message/index';
import { MessageHandlerService } from './message-handler/message-handler.service';
import { ConfirmationDialogModule, ConfirmationDialogService } from './confirmation-dialog/index';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DualListBoxModule } from './dual-list-box';
import { ClarityModule } from '@clr/angular';
import { PublishService } from './client/v1/publish.service';
import { UnauthorizedModule } from './unauthorized/unauthorized.module';
import { StorageService } from './client/v1/storage.service';
import { TabModule } from './tabs/index';
import { PaginateModule } from './paginate/index';
import { BreadcrumbModule } from './breadcrumb';
import { AceEditorModule } from './ace-editor/index';
import { ModalOperateModule } from './modal-operate/index';
import { ProgressModule } from './progress';
import { FloatWindowModule } from './float-window';
import { TipService } from './client/v1/tip.service';
import { SelectModule } from './select/index';
import { ScrollBarService } from './client/v1/scrollBar.service';
import { CopyService } from './client/v1/copy.service';
import { NavigationModule } from './navigation';
import { TabDragService } from './client/v1/tab-drag.service';
import { SelectCopyService } from './client/v1/select-copy.service';
import { CardComponent } from './card/card.compontent';
import { InputModule } from './input/index';
import { FilterBoxComponent } from './filter-box/filter-box.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { CheckboxGroupComponent } from './checkbox-group/checkbox-group.component';
import { DropDownComponent } from './dropdown/dropdown.component';
import { DropdownItemComponent } from './dropdown/item/dropdown-item.component';
import { PipeModule } from './pipe/index';
import { TranslateModule } from '@ngx-translate/core';
import { DiffModule } from './diff/index';
import { ResourceLimitModule } from './component/resource-limit/resource-limit.module';
import { EchartsModule } from './echarts/echars.module';
import { ListPodModule } from './list-pod/index';
import { ListEventComponent } from './list-event/list-event.component';
import { SideNavService } from './client/v1/sidenav.service';
import { CollapseModule } from './collapse/collapse.module';
import { ServiceModule } from './client/v1/index';
import { ListEventDatagridModule } from './list-event-datagrid';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    RouterModule,
    TranslateModule,
    BrowserModule,
    FormsModule,
    ResourceLimitModule,
    HttpClientModule,
    EchartsModule,
    ClarityModule,
    CollapseModule
  ],
  declarations: [
    CardComponent,
    FilterBoxComponent,
    CheckboxComponent,
    CheckboxGroupComponent,
    DropDownComponent,
    DropdownItemComponent,
    ListEventComponent
  ],
  exports: [
    PaginateModule,
    BrowserAnimationsModule,
    BrowserModule,
    ResourceLimitModule,
    FormsModule,
    EchartsModule,
    ClarityModule,
    DualListBoxModule,
    CardComponent,
    FilterBoxComponent,
    CheckboxComponent,
    CheckboxGroupComponent,
    DropDownComponent,
    DropdownItemComponent,
    TranslateModule,
    ListEventComponent,
    CollapseModule,
    PageNotFoundModule,
    UnauthorizedModule,
    MessageModule,
    ConfirmationDialogModule,
    TabModule,
    SelectModule,
    InputModule,
    ListPodModule,
    ModalOperateModule,
    NavigationModule,
    AceEditorModule,
    DiffModule,
    BreadcrumbModule,
    ListEventDatagridModule,
    FloatWindowModule,
    ProgressModule,
    PipeModule,
    ServiceModule
  ],
  providers: [
    SideNavService,
    TipService,
    MessageService,
    StorageService,
    PublishService,
    MessageHandlerService,
    ConfirmationDialogService,
    ScrollBarService,
    CopyService,
    TabDragService,
    SelectCopyService
  ]
})
export class SharedModule {

}
