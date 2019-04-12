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
import { BreadcrumbService } from './client/v1/breadcrumb.service';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { AceEditorModule } from './ace-editor/index';
import { ModalOperateModule } from './modal-operate/index';
import { ProgressComponent } from './progress/progress.component';
import { FloatWindowComponent } from './float-window/float-window.component';
import { FloatWindowItemComponent } from './float-window/float-window-item/float-window-item.component';
import { TipService } from './client/v1/tip.service';
import { SelectModule } from './select/index';
import { ScrollBarService } from './client/v1/scrollBar.service';
import { CopyService } from './client/v1/copy.service';
import { NavigationComponent } from './navigation/navigation.component';
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
    BreadcrumbComponent,
    ProgressComponent,
    FloatWindowComponent,
    FloatWindowItemComponent,
    NavigationComponent,
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
    BreadcrumbComponent,
    DualListBoxModule,
    ProgressComponent,
    FloatWindowComponent,
    FloatWindowItemComponent,
    NavigationComponent,
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
    AceEditorModule,
    DiffModule,
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
    BreadcrumbService,
    ScrollBarService,
    CopyService,
    TabDragService,
    SelectCopyService
  ]
})
export class SharedModule {

}
