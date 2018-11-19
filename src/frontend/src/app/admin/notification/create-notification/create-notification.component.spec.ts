import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNotificationComponent } from './create-notification.component';

describe('CreateNotificationComponent', () => {
  let component: CreateNotificationComponent;
  let fixture: ComponentFixture<CreateNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
