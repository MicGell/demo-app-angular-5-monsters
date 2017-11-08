import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { Monster } from './monster.model';

interface MonsterType {
  type: string;
  hrefData: string;
  monsters: Monster[];
  lastId: number;
  numberOfPages: number;
  loadedData: boolean;
}


export class MonstersService {
  monstersSelectedChanged = new Subject<Monster[]>();
  loadedDataChanged = new Subject<boolean>();
  private numberMonstersOnPage = 15;
  private correctUrl = false;
  private currentPageList: number;
  private selectedMonsterEdit: {id: number, indexMonster: number, indexType: number, type: string};
  private selectedMonsters: MonsterType = {
    type: '',
    hrefData: '',
    monsters: [],
    lastId: 0,
    numberOfPages: 0,
    loadedData: false
  };
  private monsterTypesNames = [];
  private monstersArray: Array<MonsterType> = [
    {
      type: 'gnomes',
      hrefData: 'http://master.datasource.jazzy-hr.jzapp.io/api/v1/gnomes',
      monsters: [],
      lastId: 0,
      numberOfPages: 0,
      loadedData: false
    },
    {
      type: 'trolls',
      hrefData: 'none',
      monsters: [],
      lastId: 0,
      numberOfPages: 0,
      loadedData: false
    }
  ];

  constructor() {
    this.monstersArray.forEach((monsters) => {
      this.monsterTypesNames.push(monsters.type);
    });
  }

  getMonstersArray() {
    return this.monstersArray;
  }

  updateService(newMonsters: Monster[], index: number, monsterType: string) {
    this.monstersArray[index].monsters = newMonsters;
    this.monstersArray[index].lastId = newMonsters.length - 1;
    this.monstersArray[index].loadedData = true;
    this.updateNumberOfPages(this.monstersArray[index]);

    if (this.currentPageList !== undefined && monsterType === this.selectedMonsters.type) {
      this.loadedDataChanged.next(true);
      this.getMonsters();
    }

  }

  checkOrSelectMonsterType(typeToCheck: string) {
    let typeExist = false;
    this.monstersArray.forEach((monsters) => {
      if (monsters.type === typeToCheck) {
        typeExist = true;
        this.selectedMonsters = monsters;
        if (monsters.hrefData === 'none') {
          monsters.loadedData = true;
          this.loadedDataChanged.next(true);
        }
      }
    });
    return typeExist;
  }

  updateNumberOfPages(selectedMonsters: MonsterType ) {
    selectedMonsters.numberOfPages = Math.ceil((selectedMonsters.monsters.length) / this.numberMonstersOnPage);
  }

  getNumberOfPages() {
    return this.selectedMonsters.numberOfPages;
  }

  setCurrentPage(currentPage: number) {
    let pageReturn = currentPage;
    this.correctUrl = true;
    if ( pageReturn > 0) {
      pageReturn--;
    } else if (pageReturn < 0) {
      this.correctUrl = false;
    }
    this.currentPageList = pageReturn;
    return this.correctUrl;
  }

  getMonsters() {
    if (this.correctUrl &&
      this.currentPageList <= this.selectedMonsters.numberOfPages &&
      this.selectedMonsters.loadedData) {
        const startIndex = this.currentPageList * this.numberMonstersOnPage;
        const endIndex = startIndex + this.numberMonstersOnPage;
        this.loadedDataChanged.next(true);
        this.monstersSelectedChanged.next(this.selectedMonsters.monsters.slice(startIndex, endIndex));
      } else {
        this.monstersSelectedChanged.next([]);
    }
  }

  removeMonster(monsterIndex: number) {
    const realIndex = monsterIndex + (this.numberMonstersOnPage * this.currentPageList);
    const startIndexForPage = this.currentPageList * this.numberMonstersOnPage;
    const endIndexForPage = startIndexForPage + this.numberMonstersOnPage - 1;
    this.selectedMonsters.monsters.splice(realIndex, 1);
    this.updateNumberOfPages(this.selectedMonsters);
    if (endIndexForPage !== this.selectedMonsters.monsters.length) {
      return this.selectedMonsters.monsters[endIndexForPage - 1];
    } else {
      return false;
    }
  }

}
