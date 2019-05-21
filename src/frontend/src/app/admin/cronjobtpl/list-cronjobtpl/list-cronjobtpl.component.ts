import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ClrDatagridStateInterface } from '@clr/angular';
import { CronjobTpl } from 'wayne-component/lib/model/v1/cronjobtpl';
import { Page } from 'wayne-component/lib/page/page-state';
import { AceEditorService } from 'wayne-component/lib/ace-editor/ace-editor.service';
import { AceEditorMsg } from 'wayne-component/lib/ace-editor/ace-editor';

@Component({
  selector: 'list-cronjobtpl',
  templateUrl: 'list-cronjobtpl.component.html'
})
export class ListCronjobTplComponent implements OnInit {

  @Input() cronjobTpls: CronjobTpl[];

  @Input() page: Page;
  currentPage = 1;
  state: ClrDatagridStateInterface;

  @Output() paginate = new EventEmitter<ClrDatagridStateInterface>();
  @Output() delete = new EventEmitter<CronjobTpl>();
  @Output() edit = new EventEmitter<CronjobTpl>();


  constructor(private router: Router,
              private aceEditorService: AceEditorService) {
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

  deleteCronjobTpl(cronjobTpl: CronjobTpl) {
    this.delete.emit(cronjobTpl);
  }

  editCronjobTpl(cronjobTpl: CronjobTpl) {
    this.edit.emit(cronjobTpl);
  }

  detailMetaDataTpl(tpl: string) {
    this.aceEditorService.announceMessage(AceEditorMsg.Instance(tpl, false, '元数据查看'));
  }
}
