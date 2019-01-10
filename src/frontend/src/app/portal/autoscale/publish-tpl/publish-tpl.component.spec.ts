import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishTplComponent } from './publish-tpl.component';

describe('PublishTplComponent', () => {
  let component: PublishTplComponent;
  let fixture: ComponentFixture<PublishTplComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublishTplComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishTplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
