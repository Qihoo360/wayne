import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrashAutoscaletplComponent } from './trash-autoscaletpl.component';

describe('TrashAutoscaletplComponent', () => {
  let component: TrashAutoscaletplComponent;
  let fixture: ComponentFixture<TrashAutoscaletplComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrashAutoscaletplComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrashAutoscaletplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
