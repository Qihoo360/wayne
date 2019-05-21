import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Namespace } from 'wayne-component/lib/model/v1/namespace';
import { Page } from 'wayne-component/lib/page/page-state';
import { AceEditorMsg } from 'wayne-component/lib/ace-editor/ace-editor';
import { AceEditorService } from 'wayne-component/lib/ace-editor/ace-editor.service';

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
