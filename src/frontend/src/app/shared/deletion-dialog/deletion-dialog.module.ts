import { NgModule } from '@angular/core';
import { DeletionDialogComponent } from './deletion-dialog.component';
import { SharedModule } from '../shared.module';

@NgModule({
  imports: [
    SharedModule
  ],
  providers: [],
  declarations: [DeletionDialogComponent],
  exports: [DeletionDialogComponent],
})
export class DeletionDialogModule {
}
