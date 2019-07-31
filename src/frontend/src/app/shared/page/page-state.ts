import { ClrDatagridStateInterface } from '@clr/angular';

export class Page {
  pageNo ? = 1;
  pageSize ? = 10;
  totalPage?: number;
  totalCount?: number;
}

export class Sort {
  by: string;
  reverse: boolean;
}

export class PageState {
  page ? = new Page();
  sort ? = new Sort();
  filters ? = {};
  // relate?: string;
  // isOnline?: boolean;
  params ? = {};

  constructor(page?: Page) {
    if (page) {
      this.page = Object.assign(this.page, page);
    }

  }

  static fromState(state: ClrDatagridStateInterface, page?: Page): PageState {
    if (!state) {
      return new PageState();
    }
    const pageState = new PageState(page);

    if (state.page) {
      pageState.page.pageNo = Math.ceil((state.page.to + 1) / state.page.size) || 1;
      pageState.page.pageSize = state.page.size;
    }
    if (state.sort) {
      pageState.sort.by = state.sort.by.toString();
      pageState.sort.reverse = state.sort.reverse;
    }
    if (state.filters) {
      for (const filter of state.filters) {
        const {property, value} = <{ property: string, value: string }>filter;
        pageState.filters[property] = value;
      }
    }
    return pageState;
  }
}

