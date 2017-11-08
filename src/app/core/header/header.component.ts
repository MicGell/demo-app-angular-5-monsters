import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {
  viewMenu = false;
  mobileMode = false;

  constructor(private route: Router) { }

  ngOnInit() {
    this.checkMobileMode(window.innerWidth);
    this.route.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.viewMenu = false;
      }
    });
  }

  checkMobileMode(width) {
    if ( width > 680) {
      this.viewMenu = false;
      this.mobileMode = false;
    } else {
      this.mobileMode = true;
    }
  }

  checkActiveMenu() {
    return this.viewMenu === true ? 'active' : 'inactive';
  }

}
