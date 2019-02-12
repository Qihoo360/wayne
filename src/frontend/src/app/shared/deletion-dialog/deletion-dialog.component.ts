import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';

@Component({
  selector: 'deletion-dialog',
  templateUrl: 'deletion-dialog.component.html',
  styleUrls: ['deletion-dialog.component.scss']
})


export class DeletionDialogComponent implements OnDestroy {
  opened = false;
  dialogTitle = '';
  dialogContent = '';
  obj: any;
  @Output() outputObj = new EventEmitter<boolean>();

  constructor() {

  }

  ngOnDestroy(): void {
  }

  open(dialogTitle, dialogContent: string, obj: any): void {
    this.dialogTitle = dialogTitle;
    this.dialogContent = dialogContent;
    this.obj = obj;
    this.opened = true;
  }

  close(): void {
    this.opened = false;
  }

  cancel(): void {
    this.close();
  }

  confirm(): void {
    this.outputObj.emit(this.obj);
    this.close();
  }
}
