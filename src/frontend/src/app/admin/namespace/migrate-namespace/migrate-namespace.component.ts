import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Namespace } from 'app/shared/model/v1/namespace';
import { NgForm } from '@angular/forms';
import { ModalComponent } from 'app/shared/modal/modal.component';
import { ModalService } from 'app/shared/modal/modal.service';
import { Subscription } from 'rxjs';
import { NamespaceService } from 'app/shared/client/v1/namespace.service';
import { MessageHandlerService } from 'app/shared/message-handler/message-handler.service';
@Component({
  selector: 'migrate-namespace',
  templateUrl: './migrate-namespace.component.html',
  styleUrls: ['./migrate-namespace.component.scss']
})
export class MigrateNamespaceComponent implements OnInit, OnDestroy {
  namespaceForm: NgForm;
  @ViewChild('namespaceForm', { static: false })
  currentForm: NgForm;
  @ViewChild(ModalComponent, { static: false })
  modalComponent: ModalComponent;

  currentNamespace: Namespace = new Namespace;
  target: number;
  namespaces: Namespace[] = [];
  subscription: Subscription;
  constructor(
    private modalService: ModalService,
    private namespaceService: NamespaceService,
    private message: MessageHandlerService
  ) {
    this.subscription = this.modalService.modalObservable$.subscribe(res => {
      switch (res.method) {
        case 'cancel':
          this.cancelEvent();
          break;
        case 'confirm':
          this.confirmEvent();
          break;
      }
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  cancelEvent() {
    this.namespaces = [];
    this.modalComponent.opened = false;
  }

  confirmEvent() {
    this.namespaceService.migrateNamespace(this.currentNamespace.id, Number(this.target))
      .subscribe(
        res => {
        this.message.showSuccess(`${this.currentNamespace.name}迁移成功`);
        this.modalComponent.opened = false;
        },
        error => this.message.error(error)
      );
  }

  open(ns: Namespace, namespaceList: Namespace[]) {
    this.target = undefined;
    this.currentNamespace = ns;
    this.modalComponent.opened = true;
    this.namespaces = namespaceList.filter(namespace => {
      return namespace.id !== ns.id;
    }) || [];
  }

  public get isValid() {
    return !!this.target;
  }

}
