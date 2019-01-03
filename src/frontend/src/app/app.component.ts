import { AfterViewInit, Component } from '@angular/core';
import { ScrollBarService } from './shared/client/v1/scrollBar.service';
import { SelectCopyService } from './shared/client/v1/select-copy.service';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from './shared/client/v1/storage.service';

@Component({
  selector: 'wayne-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  constructor(
    private scrollBar: ScrollBarService,
    private selectCopyService: SelectCopyService,
    public translate: TranslateService,
    private storage: StorageService
  ) {
    translate.addLangs(['en', 'zh-Hans']);
    const langStorage = storage.get('lang');
    translate.setDefaultLang('zh-Hans');
    if (langStorage) {
      translate.use(translate.getLangs().indexOf(langStorage) > -1 ? langStorage : 'zh-Hans');
    } else {
      translate.use('zh-Hans');
    }
  }

  ngAfterViewInit() {
    // 计算滚动条宽度
    this.scrollBar.init();
    // 滑动提示复制功能
    // this.selectCopyService.init();
  }
}
