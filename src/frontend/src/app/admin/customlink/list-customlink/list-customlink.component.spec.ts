import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCustomlinkComponent } from './list-customlink.component';

describe('ListCustomlinkComponent', () => {
  let component: ListCustomlinkComponent;
  let fixture: ComponentFixture<ListCustomlinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCustomlinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCustomlinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
