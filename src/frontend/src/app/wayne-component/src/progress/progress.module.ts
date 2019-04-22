import { NgModule } from '@angular/core';
import { ProgressComponent } from './progress.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule],
  declarations: [ProgressComponent],
  exports: [ProgressComponent]
})
export class ProgressModule { }
