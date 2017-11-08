import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { Monster } from '../monster.model';
import { MonstersService } from '../monsters.service';
import { enterLeaveTrigger } from './animations';

@Component({
  selector: 'app-monsters-list',
  templateUrl: './monsters-list.component.html',
  styleUrls: ['./monsters-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    enterLeaveTrigger
  ]
})
export class MonstersListComponent implements OnInit, OnDestroy {
  monsters: Monster[] = [];
  subscriptions: Subscription[] = [];
  page: number;
  maxPages = 0;
  monstersType: string;
  title: string;
  monsterExist: boolean;
  loadedDataBoolean = false;

  constructor(private monstersService: MonstersService,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit() {
    const monstersData = this.monstersService.monstersSelectedChanged
      .subscribe((monsters: Monster[]) => {
          this.monsters = monsters;
          this.maxPages = this.monstersService.getNumberOfPages();
        }
      );
    const routerChange = this.router.events
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.start();
        }
      });
    const loadedDataChanged = this.monstersService.loadedDataChanged
      .subscribe((loadedData: boolean) => {
        this.loadedDataBoolean = loadedData;
      });
    this.subscriptions.push(monstersData, routerChange);
    this.start();
  }

  start() {
    this.loadedDataBoolean = false;
    this.monstersType = this.route.snapshot.params['name'];
    this.page = +this.route.snapshot.params['numberPage'];
    if (this.page === 0) {
      this.page = 1;
    }
    this.monsterExist = this.monstersService.checkOrSelectMonsterType(this.monstersType);
    this.monsterExist = this.monstersService.setCurrentPage(this.page);
    if (this.monsterExist) {
        this.title = this.monstersType.charAt(0).toUpperCase() + this.monstersType.slice(1);
        setTimeout(() => {
          this.monstersService.getMonsters();
        }, 5);
    }
  }

  remove(monsterIndex: number) {
    this.monsters.splice(monsterIndex, 1);
    const newMosnter = this.monstersService.removeMonster(monsterIndex);
    this.maxPages = this.monstersService.getNumberOfPages();
    if (newMosnter) {
      setTimeout(() => {
        this.monsters.push(newMosnter);
      }, 200);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach( subscription => subscription.unsubscribe());
  }

}
