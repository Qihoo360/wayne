import {State} from '@clr/angular';

export class PageState {
  page? = new Page();
  sort? = new Sort();
  filters? = {};
  // relate?: string;
  // isOnline?: boolean;
  params? = {};

  constructor(page?: Page) {
    if (page) {
      this.page = Object.assign(this.page, page);
    }

  }

  static fromState(state: State, page?: Page): PageState {
    if (!state) {
      return new PageState();
    }
    let pageState = new PageState(page);

    if (state.page) {
      pageState.page.pageNo = Math.ceil((state.page.to + 1) / state.page.size);
      pageState.page.pageSize = state.page.size;
    }
    if (state.sort) {
      pageState.sort.by = state.sort.by.toString();
      pageState.sort.reverse = state.sort.reverse;
    }
    if (state.filters) {
      for (let filter of state.filters) {
        let {property, value} = <{ property: string, value: string }>filter;
        pageState.filters[property] = value
      }
    }
    return pageState
  }
}

export class Page {
  pageNo?: number = 1;
  pageSize?: number = 10;
  totalPage?: number;
  totalCount?: number;
}

export class Sort {
  by: string;
  reverse: boolean;
}

