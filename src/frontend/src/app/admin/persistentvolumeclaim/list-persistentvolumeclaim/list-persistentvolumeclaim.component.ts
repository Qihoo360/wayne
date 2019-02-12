import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { PersistentVolumeClaim } from '../../../shared/model/v1/persistentvolumeclaim';
import { Page } from '../../../shared/page/page-state';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { AceEditorMsg } from '../../../shared/ace-editor/ace-editor';
import { Statefulset } from '../../../shared/model/v1/statefulset';
import { Router } from '@angular/router';

@Component({
  selector: 'list-persistentvolumeclaim',
  templateUrl: 'list-persistentvolumeclaim.component.html'
})
export class ListPersistentVolumeClaimComponent implements OnInit {

  @Input() pvcs: PersistentVolumeClaim[];

  @Input() page: Page;
  currentPage = 1;
  state: ClrDatagridStateInterface;

  @Output() paginate = new EventEmitter<ClrDatagridStateInterface>();
  @Output() delete = new EventEmitter<PersistentVolumeClaim>();
  @Output() edit = new EventEmitter<PersistentVolumeClaim>();


  constructor(private aceEditorService: AceEditorService,
              private router: Router) {
  }

  ngOnInit(): void {
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

  deletePvc(pvc: PersistentVolumeClaim) {
    this.delete.emit(pvc);
  }

  goToLink(obj: Statefulset, gate: string) {
    let linkUrl = '';
    switch (gate) {
      case 'tpl':
        linkUrl = `/admin/persistentvolumeclaim/tpl?persistentVolumeClaimId=${obj.id}`;
        break;
      case 'app':
        linkUrl = `admin/app?id=${obj.app.id}`;
        break;
      default:
        break;
    }
    this.router.navigateByUrl(linkUrl);
  }

  editPvc(pvc: PersistentVolumeClaim) {
    this.edit.emit(pvc);
  }

  detailMetaDataTpl(tpl: string) {
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(tpl, false, '元数据查看'));
  }

}
