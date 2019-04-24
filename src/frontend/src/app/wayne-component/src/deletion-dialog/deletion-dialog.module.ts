import { NgModule } from '@angular/core';
import { DeletionDialogComponent } from './deletion-dialog.component';
import { ClarityModule } from '@clr/angular';

@NgModule({
  imports: [
    ClarityModule
  ],
  providers: [],
  declarations: [DeletionDialogComponent],
  exports: [DeletionDialogComponent],
})
export class DeletionDialogModule {
}
