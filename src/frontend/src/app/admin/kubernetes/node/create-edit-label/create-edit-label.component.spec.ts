import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditLabelComponent } from './create-edit-label.component';

describe('CreateEditLabelComponent', () => {
  let component: CreateEditLabelComponent;
  let fixture: ComponentFixture<CreateEditLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
