import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../shared/auth/auth.service';
import {Router} from '@angular/router';
import {AuthoriseService} from '../../shared/client/v1/auth.service';
import {LoginTokenKey} from '../../shared/shared.const';

@Component({
  selector: 'wayne-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  constructor(public authService: AuthService,
              private authoriseService: AuthoriseService,
              private router: Router) {
  }

  ngOnInit() {
  }

  goFront() {
    if (window) window.location.href = '/';
  }

  logout() {
    localStorage.removeItem(LoginTokenKey);
    this.router.navigateByUrl('/sign-in');
  }

  getTitle() {
    let imagePrefix = this.authService.config['system.title'];
    return imagePrefix ? imagePrefix : 'Wayne';
  }

}
