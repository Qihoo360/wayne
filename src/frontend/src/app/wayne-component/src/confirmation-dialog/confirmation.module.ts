import { NgModule } from '@angular/core';
import { ClarityModule } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { ConfirmationDialogService } from './confirmation-dialog.service';

@NgModule({
  imports: [ClarityModule, CommonModule, TranslateModule],
  declarations: [ConfirmationDialogComponent],
  exports: [ConfirmationDialogComponent],
  providers: [ConfirmationDialogService]
})
export class ConfirmationDialogModule { }
