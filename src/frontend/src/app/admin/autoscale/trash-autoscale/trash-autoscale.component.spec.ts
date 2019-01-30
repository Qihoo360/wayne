import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrashAutoscaleComponent } from './trash-autoscale.component';

describe('TrashAutoscaleComponent', () => {
  let component: TrashAutoscaleComponent;
  let fixture: ComponentFixture<TrashAutoscaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrashAutoscaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrashAutoscaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
