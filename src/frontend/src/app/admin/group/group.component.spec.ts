import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupComponent } from './group.component';

describe('GroupComponent', () => {
  const component: GroupComponent;
  const fixture: ComponentFixture<GroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GroupComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
