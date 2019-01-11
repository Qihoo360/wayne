import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalComponent } from './portal.component';

describe('PortalComponent', () => {
  const component: PortalComponent;
  const fixture: ComponentFixture<PortalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PortalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
