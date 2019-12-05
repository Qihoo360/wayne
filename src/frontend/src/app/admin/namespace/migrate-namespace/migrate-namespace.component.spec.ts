import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MigrateNamespaceComponent } from './migrate-namespace.component';

describe('MigrateNamespaceComponent', () => {
  let component: MigrateNamespaceComponent;
  let fixture: ComponentFixture<MigrateNamespaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MigrateNamespaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MigrateNamespaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
