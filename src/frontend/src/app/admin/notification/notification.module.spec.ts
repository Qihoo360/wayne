import { NotificationModule } from './notification.module';

describe('NotificationModule', () => {
  let notificationModule: NotificationModule;

  beforeEach(() => {
    notificationModule = new NotificationModule();
  });

  it('should create an instance', () => {
    expect(notificationModule).toBeTruthy();
  });
});
