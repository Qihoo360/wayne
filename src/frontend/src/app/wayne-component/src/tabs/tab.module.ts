import { NgModule } from '@angular/core';
import { TabsComponent } from './tabs.component';
import { TabComponent } from './tab/tab.component';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { SearchSectionComponent } from './search-section/search-section.component';
import { FormsModule } from '@angular/forms';
import { ServiceModule } from '../client/v1/index';
@NgModule({
  imports: [TranslateModule, CommonModule, FormsModule, ServiceModule],
  declarations: [TabsComponent, TabComponent, SearchSectionComponent],
  exports: [TabsComponent, TabComponent, SearchSectionComponent]
})
export class TabModule { }
