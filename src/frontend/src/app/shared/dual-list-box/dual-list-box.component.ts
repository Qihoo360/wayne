import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import 'rxjs/Rx';
import * as _ from 'lodash';
import { IItemsMovedEvent, IListBoxItem } from './models';

@Component({
  selector: 'ng2-dual-list-box',
  templateUrl: 'dual-list-box.component.html',
  styleUrls: ['dual-list-box.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DualListBoxComponent),
    multi: true
  }]
})
export class DualListBoxComponent implements OnInit, ControlValueAccessor {

  // array of items to display in left box
  @Input() set data(items: Array<{}>) {
    this.availableItems = [...(items || []).map((item: {}, index: number) => ({
      value: item[this.valueField].toString(),
      text: item[this.textField]
    }))];
    this.backupItems = this.availableItems;
  };

  // input to set search term for available list box from the outside
  @Input() set availableSearch(searchTerm: string) {
    this.searchTermAvailable = searchTerm;
    this.availableSearchInputControl.setValue(searchTerm);
  };

  // input to set search term for selected list box from the outside
  @Input() set selectedSearch(searchTerm: string) {
    this.searchTermSelected = searchTerm;
    this.selectedSearchInputControl.setValue(searchTerm);
  };

  // field to use for value of option
  @Input() valueField = 'id';
  // field to use for displaying option text
  @Input() textField = 'name';
  // text to display as title above component
  @Input() title: string;
  // time to debounce search output in ms
  @Input() debounceTime = 500;
  // show/hide button to move all items between boxes
  @Input() moveAllButton = true;
  // text displayed over the available items list box
  @Input() availableText = 'Available items';
  // text displayed over the selected items list box
  @Input() selectedText = 'Selected items';
  // set placeholder text in available items list box
  @Input() availableFilterPlaceholder = 'Filter...';
  // set placeholder text in selected items list box
  @Input() selectedFilterPlaceholder = 'Filter...';

  // event called when item or items from available items(left box) is selected
  @Output() onAvailableItemSelected: EventEmitter<{} | Array<{}>> = new EventEmitter<{} | Array<{}>>();
  // event called when item or items from selected items(right box) is selected
  @Output() onSelectedItemsSelected: EventEmitter<{} | Array<{}>> = new EventEmitter<{} | Array<{}>>();
  // event called when items are moved between boxes, returns state of both boxes and item moved
  @Output() onItemsMoved: EventEmitter<IItemsMovedEvent> = new EventEmitter<IItemsMovedEvent>();

  // private variables to manage class
  searchTermAvailable: string = '';
  searchTermSelected: string = '';
  availableItems: Array<IListBoxItem> = [];
  backupItems: Array<IListBoxItem> = [];
  selectedItems: Array<IListBoxItem> = [];
  listBoxForm: FormGroup;
  availableListBoxControl: FormControl = new FormControl();
  selectedListBoxControl: FormControl = new FormControl();
  availableSearchInputControl: FormControl = new FormControl();
  selectedSearchInputControl: FormControl = new FormControl();

  // control value accessors
  _onChange = (_: any) => {
  };
  _onTouched = () => {
  };

  constructor(public fb: FormBuilder) {
    this.listBoxForm = this.fb.group({
      availableListBox: this.availableListBoxControl,
      selectedListBox: this.selectedListBoxControl,
      availableSearchInput: this.availableSearchInputControl,
      selectedSearchInput: this.selectedSearchInputControl
    });
  }

  ngOnInit(): void {
    this.availableListBoxControl
      .valueChanges
      .subscribe((items: Array<{}>) => this.onAvailableItemSelected.emit(items));
    this.selectedListBoxControl
      .valueChanges
      .subscribe((items: Array<{}>) => this.onSelectedItemsSelected.emit(items));
    this.availableSearchInputControl
      .valueChanges
      .debounceTime(this.debounceTime)
      .distinctUntilChanged()
      .subscribe((search: string) => {
        this.searchTermAvailable = search;
      });
    this.selectedSearchInputControl
      .valueChanges
      .debounceTime(this.debounceTime)
      .distinctUntilChanged()
      .subscribe((search: string) => this.searchTermSelected = search);
  }

  /**
   * Move all items from available to selected
   */
  moveAllItemsToSelected(): void {
    let selectedItems = [];
    let leftItems = [];
    let reg = new RegExp(this.searchTermAvailable, 'gi');
    if (!this.availableItems.length) {
      return;
    }
    this.availableItems.forEach(item => {
      if (item.text.indexOf(this.searchTermAvailable.toLocaleUpperCase()) > -1) {
        selectedItems.push(item);
      } else {
        leftItems.push(item);
      }
    });
    this.selectedItems = [...this.selectedItems, ...selectedItems];
    this.availableItems = [...leftItems];
    this.onItemsMoved.emit({
      available: this.availableItems,
      selected: this.selectedItems,
      movedItems: selectedItems.map(item => item.value)
    });
    this.availableSearchInputControl.setValue('');
    this.availableListBoxControl.setValue([]);
    this.writeValue(this.getValues(), true);
  }

  /**
   * Move all items from selected to available
   */
  moveAllItemsToAvailable(): void {
    if (!this.selectedItems.length) {
      return;
    }
    let selectedItems = [];
    let leftItems = [];
    this.selectedItems.forEach(item => {
      if (item.text.indexOf(this.searchTermSelected.toLocaleUpperCase()) > -1) {
        selectedItems.push(item);
      } else {
        leftItems.push(item);
      }
    });
    this.availableItems = [...this.availableItems, ...selectedItems];
    this.selectedItems = [...leftItems];
    this.onItemsMoved.emit({
      available: this.availableItems,
      selected: this.selectedItems,
      movedItems: selectedItems.map(item => item.value)
    });
    this.selectedSearchInputControl.setValue('');
    this.selectedListBoxControl.setValue([]);
    this.writeValue([], true);
  }

  /**
   * Move marked items from available items to selected items
   */
  moveMarkedAvailableItemsToSelected(): void {

    // first move items to selected
    this.selectedItems = [...this.selectedItems,
      ..._.intersectionWith(this.availableItems, this.availableListBoxControl.value, (item: IListBoxItem, value: string) => item.value === value)];
    // now filter available items to not include marked values
    this.availableItems = [..._.differenceWith(this.availableItems, this.availableListBoxControl.value, (item: IListBoxItem, value: string) => item.value === value)];
    // clear marked available items and emit event
    this.onItemsMoved.emit({
      available: this.availableItems,
      selected: this.selectedItems,
      movedItems: this.availableListBoxControl.value
    });
    this.availableListBoxControl.setValue([]);
    this.writeValue(this.getValues(), true);
  }

  /**
   * Move marked items from selected items to available items
   */
  moveMarkedSelectedItemsToAvailable(): void {

    // first move items to available
    this.availableItems = [...this.availableItems,
      ..._.intersectionWith(this.selectedItems, this.selectedListBoxControl.value, (item: IListBoxItem, value: string) => item.value === value)];
    // now filter available items to not include marked values
    this.selectedItems = [..._.differenceWith(this.selectedItems, this.selectedListBoxControl.value, (item: IListBoxItem, value: string) => item.value === value)];
    // clear marked available items and emit event
    this.onItemsMoved.emit({
      available: this.availableItems,
      selected: this.selectedItems,
      movedItems: this.selectedListBoxControl.value
    });
    this.selectedListBoxControl.setValue([]);
    this.writeValue(this.getValues(), true);
  }

  /**
   * Move single item from available to selected
   * @param item
   */
  moveAvailableItemToSelected(item: IListBoxItem): void {

    this.availableItems = this.availableItems.filter((listItem: IListBoxItem) => listItem.value !== item.value);
    this.selectedItems = [...this.selectedItems, item];
    this.onItemsMoved.emit({
      available: this.availableItems,
      selected: this.selectedItems,
      movedItems: [item.value]
    });
    this.availableListBoxControl.setValue([]);
    this.writeValue(this.getValues(), true);
  }

  /**
   * Move single item from selected to available
   * @param item
   */
  moveSelectedItemToAvailable(item: IListBoxItem): void {

    this.selectedItems = this.selectedItems.filter((listItem: IListBoxItem) => listItem.value !== item.value);
    this.availableItems = [...this.availableItems, item];
    this.onItemsMoved.emit({
      available: this.availableItems,
      selected: this.selectedItems,
      movedItems: [item.value]
    });
    this.selectedListBoxControl.setValue([]);
    this.writeValue(this.getValues(), true);
  }

  /**
   * Function to pass to ngFor to improve performance, tracks items
   * by the value field
   * @param index
   * @param item
   * @returns {any}
   */
  trackByValue(index: number, item: {}): string {
    return item[this.valueField];
  }

  /* Methods from ControlValueAccessor interface, required for ngModel and formControlName - begin */
  writeValue(value: any, source: boolean = false): void {
    if (source) {
      if (this.selectedItems && value && value.length > 0) {
        this.selectedItems = [...this.selectedItems,
          ..._.intersectionWith(this.availableItems, value, (item: IListBoxItem, value: string) => item.value === value)];
        this.availableItems = [..._.differenceWith(this.availableItems, value, (item: IListBoxItem, value: string) => item.value === value)];
      }
    } else {
      if (this.selectedItems && value && value.length > 0) {
        this.availableItems = this.backupItems;
        this.selectedItems = [
          ..._.intersectionWith(this.availableItems, value, (item: IListBoxItem, value: string) => item.value === value)
        ];
        this.availableItems = [
          ..._.differenceWith(this.availableItems, value, (item: IListBoxItem, value: string) => item.value === value)
        ];
      }
      if (value && value.length === 0) {
        this.selectedItems = [];
        this.availableItems = this.backupItems;
      }
    }
    this._onChange(value);
  }

  registerOnChange(fn: (_: any) => {}): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => {}): void {
    this._onTouched = fn;
  }

  /* Methods from ControlValueAccessor interface, required for ngModel and formControlName - end */

  /**
   * Utility method to get values from
   * selected items
   * @returns {string[]}
   */
  private getValues(): any[] {
    return (this.selectedItems || []).map((item: IListBoxItem) => item.value);
  }
}
