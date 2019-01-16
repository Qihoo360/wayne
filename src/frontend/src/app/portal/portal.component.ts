import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { defaultRoutingUrl } from '../shared/shared.const';
import { CacheService } from '../shared/auth/cache.service';

@Component({
  selector: 'wayne-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.scss']
})
export class PortalComponent implements OnInit {

  constructor(private router: Router,
              public cacheService: CacheService) {
  }

  ngOnInit() {
    if (this.router.url === '/portal') {
      this.router.navigate([defaultRoutingUrl]);
    }
  }

}
