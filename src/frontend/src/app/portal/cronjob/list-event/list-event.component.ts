import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/combineLatest';
import { Inventory, TimeComparator } from './inventory';
import { Event } from '../../../shared/model/v1/deploymenttpl';
import { SortOrder } from '@clr/angular';

@Component({
  selector: 'list-event',
  providers: [Inventory],
  templateUrl: 'list-event.component.html',
  styleUrls: ['list-event.scss']
})

export class ListEventComponent implements OnInit {
  checkOnGoing: boolean = false;
  isSubmitOnGoing: boolean = false;
  modalOpened: boolean;
  warnings: Event[];
  sortOrder: SortOrder = SortOrder.Unsorted;
  sorted: boolean = false;

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
