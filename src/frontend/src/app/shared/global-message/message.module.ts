import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClrIconModule } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import { MessageComponent } from './message.component';
@NgModule({
  imports: [CommonModule, ClrIconModule, TranslateModule],
  declarations: [MessageComponent],
  exports: [MessageComponent]
})
export class MessageModule { }
