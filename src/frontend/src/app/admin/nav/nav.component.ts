import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth/auth.service';
import { Router } from '@angular/router';
import { AuthoriseService } from '../../shared/client/v1/auth.service';
import { LoginTokenKey } from '../../shared/shared.const';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../shared/client/v1/storage.service';

@Component({
  selector: 'wayne-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  currentLang: string;

  constructor(public authService: AuthService,
              private authoriseService: AuthoriseService,
              public translate: TranslateService,
              private storage: StorageService,
              private router: Router) {
  }

  ngOnInit() {
    this.currentLang = this.translate.currentLang;
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.currentLang = event.lang;
    });
  }

  goFront() {
    if (window) {
      window.location.href = '/';
    }
  }

  showLang(lang: string): string {
    switch (lang) {
      case 'en':
        return 'English';
      case 'zh-Hans':
        return '中文简体';
      default:
        return '';
    }
  }

  changeLang(lang: string) {
    this.translate.use(lang);
    this.storage.save('lang', lang);
  }

  logout() {
    localStorage.removeItem(LoginTokenKey);
    this.router.navigateByUrl('/sign-in');
  }

  getTitle() {
    const imagePrefix = this.authService.config['system.title'];
    return imagePrefix ? imagePrefix : 'Wayne';
  }

}
