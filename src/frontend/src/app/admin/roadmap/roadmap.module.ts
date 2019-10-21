import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { RoadmapComponent } from './roadmap.component';
import { ListRoadmapComponent } from './list-roadmap/list-roadmap.component';
import { RoadmapService } from '../../shared/client/v1/roadmap.service';
import { CreateEditRoadmapComponent } from './create-edit-roadmap/create-edit-roadmap.component';

@NgModule({
  imports: [
    SharedModule
  ],
  providers: [RoadmapService],
  declarations: [RoadmapComponent, ListRoadmapComponent, CreateEditRoadmapComponent]
})
export class RoadMapModule { }
