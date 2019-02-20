import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/combineLatest';
import { Inventory, TimeComparator } from './inventory';
import { Event } from '../model/v1/deploymenttpl';
import { ClrDatagridSortOrder } from '@clr/angular';

@Component({
  selector: 'list-event',
  providers: [Inventory],
  templateUrl: 'list-event.component.html',
  styleUrls: ['list-event.scss']
})

export class ListEventComponent implements OnInit {
  checkOnGoing = false;
  isSubmitOnGoing = false;
  modalOpened: boolean;
  warnings: Event[];
  sortOrder: ClrDatagridSortOrder = ClrDatagridSortOrder.UNSORTED;
  sorted = false;

  timeComparator = new TimeComparator();

  constructor(private inventory: Inventory) {
  }

  openModal(warnings: Event[]) {
    this.modalOpened = true;
    this.inventory.size = warnings.length;
    this.inventory.reset(warnings);
    this.warnings = this.inventory.all;
  }


  ngOnInit(): void {

  }


}


