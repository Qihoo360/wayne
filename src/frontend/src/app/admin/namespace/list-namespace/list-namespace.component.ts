import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Namespace } from '../../../shared/model/v1/namespace';
import { Page } from '../../../shared/page/page-state';
import { AceEditorMsg } from '../../../shared/ace-editor/ace-editor';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';

@Component({
  selector: 'list-namespace',
  templateUrl: 'list-namespace.component.html'
})
export class ListNamespaceComponent {

  @Input() namespaces: Namespace[];

  @Input() page: Page;
  currentPage = 1;
  state: ClrDatagridStateInterface;

  @Output() paginate = new EventEmitter<ClrDatagridStateInterface>();
  @Output() delete = new EventEmitter<Namespace>();
  @Output() edit = new EventEmitter<Namespace>();
  @Output() migrate = new EventEmitter<Namespace>();

  constructor(private router: Router,
              private aceEditorService: AceEditorService) {
  }

  pageSizeChange(pageSize: number) {
    this.state.page.to = pageSize - 1;
    this.state.page.size = pageSize;
    this.currentPage = 1;
    this.paginate.emit(this.state);
  }

  refresh(state: ClrDatagridStateInterface) {
    this.state = state;
    this.paginate.emit(state);
  }

  deleteNamespace(ns: Namespace) {
    this.delete.emit(ns);
  }

  editNamespace(ns: Namespace) {
    this.edit.emit(ns);
  }

  migrateNamespace(ns: Namespace) {
    this.migrate.emit(ns);
  }

  goToLink(ns: Namespace, gate: string) {
    let linkUrl = '';
    switch (gate) {
      case 'app':
        linkUrl = `/admin/app?namespaceId=${ns.id}`;
        break;
      default:
        break;
    }
    this.router.navigateByUrl(linkUrl);
  }

  detailMetaDataTpl(tpl: string) {
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(tpl, false, '元数据查看'));
  }
}
