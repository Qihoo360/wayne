export class ModalInfo {
  title?: string;
  modalOpened?: boolean;
  hiddenFooter?: boolean;

  static emptyObject(): ModalInfo {
    const result = new ModalInfo();
    result.title = '编辑模版';
    result.modalOpened = true;
    result.hiddenFooter = false;
    return result;
  }
}
