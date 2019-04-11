import { NgModule } from '@angular/core';
import { ClarityModule } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
@NgModule({
  imports: [ClarityModule, CommonModule, TranslateModule],
  declarations: [ConfirmationDialogComponent],
  exports: [ConfirmationDialogComponent]
})
export class ConfirmationDialogModule { }
