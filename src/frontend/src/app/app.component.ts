import { Component, AfterViewInit } from '@angular/core';
import {ScrollBarService} from './shared/client/v1/scrollBar.service';
import {SelectCopyService} from './shared/client/v1/select-copy.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'wayne-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  constructor(
    private scrollBar: ScrollBarService,
    private selectCopyService: SelectCopyService,
    public translate: TranslateService
  ) {
    translate.addLangs(['en', 'zh']);
    translate.setDefaultLang('en');
    const browserLang = translate.getBrowserLang();
    console.log(browserLang);
    translate.use(browserLang.match(/en|fr|zh/) ? browserLang : 'en');
  }

  ngAfterViewInit() {
    // 计算滚动条宽度
    this.scrollBar.init();
    // 滑动提示复制功能
    // this.selectCopyService.init();
  }
}
