import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClrIconModule } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import { MessageComponent } from './message.component';
import { MessageService } from './message.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageHandlerService } from './message-handler.service';
@NgModule({
  imports: [CommonModule, ClrIconModule, TranslateModule, BrowserAnimationsModule],
  declarations: [MessageComponent],
  exports: [MessageComponent],
  providers: [
    MessageService,
    MessageHandlerService
  ]
})
export class MessageModule { }
