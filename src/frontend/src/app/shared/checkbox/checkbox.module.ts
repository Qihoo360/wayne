import { NgModule } from '@angular/core';
import { CheckboxComponent } from './checkbox.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [FormsModule],
  declarations: [CheckboxComponent],
  exports: [CheckboxComponent]
})
export class CheckboxModule { }
