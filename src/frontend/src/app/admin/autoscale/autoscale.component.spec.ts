import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoscaleComponent } from './autoscale.component';

describe('AutoscaleComponent', () => {
  let component: AutoscaleComponent;
  let fixture: ComponentFixture<AutoscaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoscaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoscaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
