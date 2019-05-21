import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MessageHandlerService } from './message-handler/message-handler.service';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { ClarityModule } from '@clr/angular';
// import { PageNotFoundModule } from './not-found';
// import { MessageModule } from './global-message';
// import { ConfirmationDialogModule } from './confirmation-dialog';
// import { DualListBoxModule } from './dual-list-box';
// import { UnauthorizedModule } from './unauthorized';
// import { TabModule } from './tabs';
// import { PaginateModule } from './paginate';
// import { BreadcrumbModule } from './breadcrumb';
// import { AceEditorModule } from './ace-editor';
// import { ModalOperateModule } from './modal-operate';
// import { ProgressModule } from './progress';
// import { FloatWindowModule } from './float-window';
// import { SelectModule } from './select';
// import { NavigationModule } from './navigation';
// import { CardModule } from './card';
// import { InputModule } from './input';
// import { FilterBoxModule } from './filter-box';
// import { CheckboxModule } from './checkbox';
// import { CheckboxGroupModule } from './checkbox-group';
// import { DropDownModule } from './dropdown';
// import { PipeModule } from './pipe';
// import { DiffModule } from './diff';
// import { ResourceLimitModule } from './component';
// import { EchartsModule } from './echarts/echars.module';
// import { ListPodModule } from './list-pod';
// import { ListEventModule } from './list-event';
// import { CollapseModule } from './collapse';
// import { ServiceModule } from './client/v1';
// import { ListEventDatagridModule } from './list-event-datagrid';
// import { BoxModule } from './box';
import { BoxModule, WayneModule } from 'wayne-component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    RouterModule,
    TranslateModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ClarityModule,
    WayneModule,
    // ResourceLimitModule,
    // EchartsModule,
    // CollapseModule,
  ],
  declarations: [
  ],
  exports: [
    ClarityModule,
    FormsModule,
    BrowserModule,
    // BoxModule,
    BrowserAnimationsModule,
    WayneModule
    // PaginateModule,
    // ResourceLimitModule,
    // EchartsModule,
    // DualListBoxModule,
    // FilterBoxModule,
    // CheckboxModule,
    // CheckboxGroupModule,
    // DropDownModule,
    // TranslateModule,
    // ListEventModule,
    // CollapseModule,
    // PageNotFoundModule,
    // UnauthorizedModule,
    // MessageModule,
    // ConfirmationDialogModule,
    // TabModule,
    // SelectModule,
    // InputModule,
    // ListPodModule,
    // ModalOperateModule,
    // NavigationModule,
    // AceEditorModule,
    // DiffModule,
    // BreadcrumbModule,
    // CardModule,
    // ListEventDatagridModule,
    // FloatWindowModule,
    // ProgressModule,
    // PipeModule,
    // ServiceModule
  ],
  providers: [
    MessageHandlerService
  ]
})
export class SharedModule {

}
