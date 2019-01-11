import { NgModule } from '@angular/core';
import { EchartsGaugeComponent } from './gauge/gauge.component';
import { EchartsPieComponent } from './pie/pie.component';
@NgModule({
  imports: [],
  exports: [
    EchartsGaugeComponent,
    EchartsPieComponent
  ],
  declarations: [
    EchartsGaugeComponent,
    EchartsPieComponent
  ]
})
export class EchartsModule { }
