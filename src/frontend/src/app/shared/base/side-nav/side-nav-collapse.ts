import { OnInit } from '@angular/core';
import { SideNavCollapseStorage } from '../../../shared/sidenav.const';

export class SideNavCollapse implements OnInit {
  constructor(
    public storage: any
  ) { }
  _collapsed = false;
  get collapsed() {
    return this._collapsed;
  }
  set collapsed(value: boolean) {
    this._collapsed = value;
    this.storage.save(SideNavCollapseStorage, value);
  }
  ngOnInit() {
    this._collapsed = this.storage.get(SideNavCollapseStorage) === 'false' ? false : true;
  }
}
