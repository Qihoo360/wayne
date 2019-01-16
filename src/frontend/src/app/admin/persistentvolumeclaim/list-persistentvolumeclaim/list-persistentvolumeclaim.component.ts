import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { State } from '@clr/angular';
import { PersistentVolumeClaim } from '../../../shared/model/v1/persistentvolumeclaim';
import { Page } from '../../../shared/page/page-state';
import { AceEditorService } from '../../../shared/ace-editor/ace-editor.service';
import { AceEditorMsg } from '../../../shared/ace-editor/ace-editor';

@Component({
  selector: 'list-persistentvolumeclaim',
  templateUrl: 'list-persistentvolumeclaim.component.html'
})
export class ListPersistentVolumeClaimComponent implements OnInit {

  @Input() pvcs: PersistentVolumeClaim[];

  @Input() page: Page;
  currentPage = 1;
  state: State;

  @Output() paginate = new EventEmitter<State>();
  @Output() delete = new EventEmitter<PersistentVolumeClaim>();
  @Output() edit = new EventEmitter<PersistentVolumeClaim>();


  constructor(private aceEditorService: AceEditorService) {
  }

  ngOnInit(): void {
  }

  pageSizeChange(pageSize: number) {
    this.state.page.to = pageSize - 1;
    this.state.page.size = pageSize;
    this.currentPage = 1;
    this.paginate.emit(this.state);
  }

  refresh(state: State) {
    this.state = state;
    this.paginate.emit(state);
  }

  deletePvc(pvc: PersistentVolumeClaim) {
    this.delete.emit(pvc);
  }

  editPvc(pvc: PersistentVolumeClaim) {
    this.edit.emit(pvc);
  }

  detailMetaDataTpl(tpl: string) {
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(tpl, false, '元数据查看'));
  }

}
