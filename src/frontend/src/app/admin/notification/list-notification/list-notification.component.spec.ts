import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListNotificationComponent } from './list-notification.component';

describe('ListNotificationComponent', () => {
  let component: ListNotificationComponent;
  let fixture: ComponentFixture<ListNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
