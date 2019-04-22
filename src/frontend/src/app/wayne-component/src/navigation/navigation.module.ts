import { NgModule } from '@angular/core';
import { NavigationComponent } from './navigation.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [CommonModule, TranslateModule],
  declarations: [NavigationComponent],
  exports: [NavigationComponent]
})
export class NavigationModule { }
