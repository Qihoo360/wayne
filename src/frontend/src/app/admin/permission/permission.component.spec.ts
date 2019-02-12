import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionComponent } from './permission.component';

describe('PermissionComponent', () => {
  const component: PermissionComponent;
  const fixture: ComponentFixture<PermissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PermissionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
