import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditCustomlinkComponent } from './create-edit-customlink.component';

describe('CreateEditCustomlinkComponent', () => {
  let component: CreateEditCustomlinkComponent;
  let fixture: ComponentFixture<CreateEditCustomlinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditCustomlinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditCustomlinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
