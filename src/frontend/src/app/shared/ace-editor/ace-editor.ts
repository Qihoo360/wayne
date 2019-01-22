export class AceEditorMsg {
  title: string;
  message: any;
  edit: boolean;

  constructor() {
  }

  static Instance(message: any, edit?: boolean, title?: string): AceEditorMsg {
    const msg = new AceEditorMsg();
    msg.title = title;
    msg.edit = edit;
    msg.message = message;
    return msg;
  }

}
