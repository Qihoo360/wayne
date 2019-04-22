import { NgModule } from '@angular/core';
import { BreadcrumbComponent } from './breadcrumb.component';
import { BrowserModule } from '@angular/platform-browser';
import { BreadcrumbService } from '../client/v1/breadcrumb.service';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [BrowserModule, CommonModule],
  declarations: [BreadcrumbComponent],
  exports: [BreadcrumbComponent],
  providers: [BreadcrumbService]
})
export class BreadcrumbModule { }
