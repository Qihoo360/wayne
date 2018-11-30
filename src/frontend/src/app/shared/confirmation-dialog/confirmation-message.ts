import { ConfirmationButtons, ConfirmationTargets } from '../shared.const';

export class ConfirmationMessage {
  public constructor(title: string, message: string, data: any, targetId: ConfirmationTargets, buttons?: ConfirmationButtons) {
    this.title = title;
    this.message = message;
    this.data = data;
    this.targetId = targetId;
    this.buttons = buttons ? buttons : ConfirmationButtons.CONFIRM_CANCEL;
  }

  title: string;
  message: string;
  data: any = {};//default is empty
  targetId: ConfirmationTargets = ConfirmationTargets.EMPTY;
  param: string;
  buttons: ConfirmationButtons;
}
