import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DualListBoxComponent } from './dual-list-box.component';
import { ArrayFilterPipe, ArraySortPipe } from './array.pipes';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  declarations: [
    ArraySortPipe,
    ArrayFilterPipe,
    DualListBoxComponent
  ],
  exports: [
    DualListBoxComponent
  ]
})
export class DualListBoxModule {
}
