import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'wayne-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  version = require('../../../../package.json').version;
  year = new Date().getFullYear().toString();

  constructor() {
  }

  ngOnInit() {
  }

}
