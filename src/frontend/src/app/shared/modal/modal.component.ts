import { Component, OnInit, Input } from '@angular/core';
import { ModalService } from 'app/shared/modal/modal.service';

@Component({
  selector: 'wayne-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  opened = false;
  @Input() isValid = false;
  constructor(
    private modalService: ModalService
  ) { }

  ngOnInit() {
  }

  onSubmit() {
    this.modalService.comfirm();
  }

  onCancel() {
    this.modalService.cancel();
  }

}
