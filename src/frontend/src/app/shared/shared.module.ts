import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PageNotFoundModule } from './not-found';
import { MessageModule, MessageService } from './global-message';
import { MessageHandlerService } from './message-handler/message-handler.service';
import { ConfirmationDialogModule, ConfirmationDialogService } from './confirmation-dialog';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DualListBoxModule } from './dual-list-box';
import { ClarityModule } from '@clr/angular';
import { PublishService } from './client/v1/publish.service';
import { UnauthorizedModule } from './unauthorized';
import { StorageService } from './client/v1/storage.service';
import { TabModule } from './tabs';
import { PaginateModule } from './paginate';
import { BreadcrumbModule } from './breadcrumb';
import { AceEditorModule } from './ace-editor';
import { ModalOperateModule } from './modal-operate';
import { ProgressModule } from './progress';
import { FloatWindowModule } from './float-window';
import { TipService } from './client/v1/tip.service';
import { SelectModule } from './select';
import { ScrollBarService } from './client/v1/scrollBar.service';
import { CopyService } from './client/v1/copy.service';
import { NavigationModule } from './navigation';
import { TabDragService } from './client/v1/tab-drag.service';
import { SelectCopyService } from './client/v1/select-copy.service';
import { CardModule } from './card';
import { InputModule } from './input';
import { FilterBoxModule } from './filter-box';
import { CheckboxModule } from './checkbox';
import { CheckboxGroupModule } from './checkbox-group';
import { DropDownModule } from './dropdown';
import { PipeModule } from './pipe';
import { TranslateModule } from '@ngx-translate/core';
import { DiffModule } from './diff';
import { ResourceLimitModule } from './component';
import { EchartsModule } from './echarts/echars.module';
import { ListPodModule } from './list-pod';
import { ListEventModule } from './list-event';
import { SideNavService } from './client/v1/sidenav.service';
import { CollapseModule } from './collapse';
import { ServiceModule } from './client/v1';
import { ListEventDatagridModule } from './list-event-datagrid';
import { BoxModule } from './box';

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
  ],
  exports: [
    BoxModule,
    PaginateModule,
    BrowserAnimationsModule,
    BrowserModule,
    ResourceLimitModule,
    FormsModule,
    EchartsModule,
    ClarityModule,
    DualListBoxModule,
    FilterBoxModule,
    CheckboxModule,
    CheckboxGroupModule,
    DropDownModule,
    TranslateModule,
    ListEventModule,
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
    CardModule,
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
