import { Component, OnInit, ViewEncapsulation, ViewChild, HostListener } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

import { toggleMenuTrigger } from './animation';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    toggleMenuTrigger
  ]
})
export class HeaderComponent implements OnInit {
  @ViewChild('menuContainer') menuDiv;
  viewMenu = false;
  mobileMode = false;
  stickyMenu = false;

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

  @HostListener('window:scroll')
  handleScrollEvent() {
    const heightMenu = this.menuDiv.nativeElement.clientHeight;
    if (window.pageYOffset > heightMenu) {
      this.stickyMenu = true;
    } else {
      this.stickyMenu = false;
    }
  }

  goLink(link) {
    this.route.navigate([link]);
  }

}
