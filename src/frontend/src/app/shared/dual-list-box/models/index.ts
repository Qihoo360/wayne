/**
 * Helper interface for listbox items
 */
export interface IListBoxItem {
    value: string;
    text: string;
}
/**
 * Helper interface to emit event when
 * items are moved between boxes
 */
export interface IItemsMovedEvent {
    available: Array<{}>;
    selected: Array<{}>;
    movedItems: Array<{}>;
}
