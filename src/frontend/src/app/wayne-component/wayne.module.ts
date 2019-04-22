import { NgModule } from '@angular/core';
import { PageNotFoundModule } from './src/not-found';
import { MessageModule } from './src/global-message';
import { ConfirmationDialogModule } from './src/confirmation-dialog';
import { DualListBoxModule } from './src/dual-list-box';
import { UnauthorizedModule } from './src/unauthorized';
import { TabModule } from './src/tabs';
import { PaginateModule } from './src/paginate';
import { BreadcrumbModule } from './src/breadcrumb';
import { AceEditorModule } from './src/ace-editor';
import { ModalOperateModule } from './src/modal-operate';
import { ProgressModule } from './src/progress';
import { FloatWindowModule } from './src/float-window';
import { SelectModule } from './src/select';
import { NavigationModule } from './src/navigation';
import { CardModule } from './src/card';
import { InputModule } from './src/input';
import { FilterBoxModule } from './src/filter-box';
import { CheckboxModule } from './src/checkbox';
import { CheckboxGroupModule } from './src/checkbox-group';
import { DropDownModule } from './src/dropdown';
import { PipeModule } from './src/pipe';
import { DiffModule } from './src/diff';
import { ResourceLimitModule } from './src/component';
import { ListPodModule } from './src/list-pod';
import { ListEventModule } from './src/list-event';
import { CollapseModule } from './src/collapse';
import { ServiceModule } from './src/client/v1';
import { ListEventDatagridModule } from './src/list-event-datagrid';
import { BoxModule } from './src/box';
import { PublishHistoryModule } from './src/publish-history';

@NgModule({
  exports: [
    BoxModule,
    PaginateModule,
    ResourceLimitModule,
    DualListBoxModule,
    FilterBoxModule,
    CheckboxModule,
    CheckboxGroupModule,
    DropDownModule,
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
    PublishHistoryModule,
    ProgressModule,
    PipeModule,
    ServiceModule
  ]
})
export class WayneModule { }
