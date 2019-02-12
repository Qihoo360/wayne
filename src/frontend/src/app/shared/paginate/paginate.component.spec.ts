import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginateComponent } from './paginate.component';

describe('PaginateComponent', () => {
  const component: PaginateComponent;
  const fixture: ComponentFixture<PaginateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PaginateComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
