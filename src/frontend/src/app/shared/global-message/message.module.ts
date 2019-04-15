import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClrIconModule } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import { MessageComponent } from './message.component';
import { MessageService } from './message.service';

@NgModule({
  imports: [CommonModule, ClrIconModule, TranslateModule],
  declarations: [MessageComponent],
  exports: [MessageComponent],
  providers: [
    MessageService
  ]
})
export class MessageModule { }
