import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NamespaceComponent } from './namespace.component';

describe('NamespaceComponent', () => {
  const component: NamespaceComponent;
  const fixture: ComponentFixture<NamespaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NamespaceComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NamespaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
