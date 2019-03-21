import { ClrDatagridStateInterface } from '@clr/angular';
import { PageState } from '../page/page-state';

export class PageComponent {
  pageState: PageState = new PageState();
  currentPage = 1;
  state: ClrDatagridStateInterface;

  pageSizeChange(pageSize: number) {
    this.state.page.to = pageSize - 1;
    this.state.page.size = pageSize;
    this.currentPage = 1;
    this.refresh(this.state);
  }

  refresh(state?: ClrDatagridStateInterface) {
  }
}
