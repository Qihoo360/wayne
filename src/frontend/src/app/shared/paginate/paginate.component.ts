import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StorageService } from '../client/v1/storage.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'wayne-paginate',
  templateUrl: './paginate.component.html',
  styleUrls: ['./paginate.component.scss']
})
export class PaginateComponent implements OnInit {
  /*
        必须参数是currentPage，total。
        @param localSave: 默认开启从localstorage里边读取，可以设置为false, 同时需要设置pageSizes;
        @param rate: 考虑到有的列表对local存储取值较小，加入这个比例参数;
        @param sizeChange: 输出属性，参数是pagesize。
    */
  private _current: number;
  @Input() total: number;
  @Input() set currentPage(value) {
    this._current = value;
  }
  @Input() pageSizes: Array<number>;
  @Input() rate = 1;
  @Input() _size = 10;
  @Input() localSave = true;
  @Output() sizeChange = new EventEmitter<number>();
  @Output() currentPageChange = new EventEmitter<number>();

  get current() {
    return this._current || 1;
  }

  set current(value: number) {
    this.currentPageChange.emit(value);
  }

  get lastPage(): number {
    try {
      return Math.ceil(this.total / this._size);
    } catch (e) {
      return 1;
    }
  }

  get pageList(): Array<any> {
    try {
      const pageList = Array();
      for (let key = 1; key <= this.lastPage; key++) {
        pageList.push(key);
      }
      return pageList;
    } catch (e) {
      return [1];
    }
  }

  get showSize() {
    return this.pageSizes !== undefined;
  }

  constructor(
    private storage: StorageService,
    public translate: TranslateService
  ) {
  }

  ngOnInit() {
    if (this.localSave && this.pageSizes) {
      this._size = parseInt(this.storage.get('pagesize'), 10) * this.rate || 10 * this.rate;
      if (this.pageSizes.indexOf(this._size) === -1) {
        this.pageSizes.push(this._size);
        this.pageSizes.sort((a, b) => a - b);
      }
    }
  }

  get size() {
    return this._size;
  }

  set size(value) {
    // Number(value) 防止出现 00 类似情况。
    if (Number(value) && value !== this._size) {
      this._size = Number(value);
      if (this.localSave && this.pageSizes && this.pageSizes.indexOf(value) > -1) {
        this.storage.save('pagesize', this._size / this.rate);
      }
      this.sizeChange.emit(this._size);
    }
  }
}
