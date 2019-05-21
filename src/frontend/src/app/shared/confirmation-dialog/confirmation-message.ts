import { ConfirmationButtons, ConfirmationTargets } from '../shared.const';

export class ConfirmationMessage {
  public constructor(title: string, message: string, data: any, target: any, buttons?: ConfirmationButtons) {
    this.title = title;
    this.message = message;
    this.data = data;
    this.target = target;
    this.buttons = buttons ? buttons : ConfirmationButtons.CONFIRM_CANCEL;
  }

  title: string;
  message: string;
  data: any = {}; // default is empty
  target = ConfirmationTargets.EMPTY;
  param: string;
  buttons: ConfirmationButtons;
}
