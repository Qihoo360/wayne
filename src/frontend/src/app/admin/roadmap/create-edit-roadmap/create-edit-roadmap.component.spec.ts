import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditRoadmapComponent } from './create-edit-roadmap.component';

describe('CreateEditRoadmapComponent', () => {
  let component: CreateEditRoadmapComponent;
  let fixture: ComponentFixture<CreateEditRoadmapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditRoadmapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditRoadmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
