import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Ingress } from '../../../shared/model/v1/ingress';
import { Page } from '../../../shared/page/page-state';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { AceEditorMsg } from '../../../shared/ace-editor/ace-editor';

@Component({
  selector: 'list-ingress',
  templateUrl: 'list-ingress.component.html'
})
export class ListIngressComponent {

  @Input() ingresses: Ingress[];

  @Input() page: Page;
  currentPage = 1;
  state: ClrDatagridStateInterface;

  @Output() paginate = new EventEmitter<ClrDatagridStateInterface>();
  @Output() delete = new EventEmitter<Ingress>();
  @Output() edit = new EventEmitter<Ingress>();

  constructor(private router: Router, private aceEditorService: AceEditorService) {}

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

  deleteIngress(ingress: Ingress) {
    this.delete.emit(ingress);
  }

  editIngress(ingress: Ingress) {
    this.edit.emit(ingress);
  }

  goToLink(obj: Ingress, gate: string) {
    let linkUrl = '';
    switch (gate) {
      case 'tpl':
        linkUrl = `/admin/ingress/tpl?ingressId=${obj.id}`;
        break;
      case 'app':
        linkUrl = `admin/app?id=${obj.app.id}`;
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
