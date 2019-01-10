import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditAutoscaletplComponent } from './create-edit-autoscaletpl.component';

describe('CreateEditAutoscaletplComponent', () => {
  let component: CreateEditAutoscaletplComponent;
  let fixture: ComponentFixture<CreateEditAutoscaletplComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditAutoscaletplComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditAutoscaletplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
