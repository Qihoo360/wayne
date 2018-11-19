import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'wayne-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  version: String = require('../../../../package.json').version;
  year: String = new Date().getFullYear().toString();

  constructor() { }

  ngOnInit() {
  }

}
