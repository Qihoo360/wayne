import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditTaintComponent } from './create-edit-taint.component';

describe('CreateEditTaintComponent', () => {
  let component: CreateEditTaintComponent;
  let fixture: ComponentFixture<CreateEditTaintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditTaintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditTaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
