import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { Monster } from './monster.model';

interface MonsterType {
  type: string;
  hrefData: string;  [x: string]: any;

  monsters: Monster[];
  lastId: number;
  numberOfPages: number;
  loadedData: boolean;
}


export class MonstersService {
  monstersSelectedChanged = new Subject<Monster[]>();
  loadedDataChanged = new Subject<boolean>();
  monsterEditedChanged = new Subject<Monster>();
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

  getMonstersTypesNames() {
    return this.monsterTypesNames;
  }

  updateService(newMonsters: Monster[], index: number, monsterType: string) {
    this.monstersArray[index].monsters = newMonsters;
    this.monstersArray[index].lastId = newMonsters.length - 1;
    this.monstersArray[index].loadedData = true;
    this.updateNumberOfPages(this.monstersArray[index]);

    if (this.currentPageList !== undefined && monsterType === this.selectedMonsters.type) {
      this.loadedDataChanged.next(true);
      this.getMonsters();
    } else if (this.selectedMonsterEdit) {
      this.activeMonsterToEdit();
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

  addMonster(newMonster: Monster) {
    const monstersFound = this.monstersArray.find( (monsters) => monsters.type === newMonster.type);
    monstersFound.lastId++;
    newMonster.id = monstersFound.lastId;
    monstersFound.monsters.push(newMonster);
    this.updateNumberOfPages(monstersFound);
  }

  updateMonster(newMonster: Monster) {
    if (this.selectedMonsterEdit) {
      const type = this.selectedMonsterEdit.indexType;
      const monster = this.selectedMonsterEdit.indexMonster;
      this.monstersArray[type].monsters[monster] = newMonster;
    }
  }

  sendMonsterToEdit(monsterId: number, monsterType: string) {
    this.selectedMonsterEdit = {
      id: monsterId,
      indexMonster: -1,
      indexType: -1,
      type: monsterType
    };
    this.activeMonsterToEdit();
  }

  activeMonsterToEdit() {
    if (this.selectedMonsterEdit) {
      const monsterEdit = this.selectedMonsterEdit;
      const monstersFound = this.monstersArray.find( (monsters) => monsters.type === monsterEdit.type);
      const monsterFound = monstersFound.monsters.find( monster => monster.id === monsterEdit.id);

      this.selectedMonsterEdit.indexType = this.monstersArray.indexOf(monstersFound);
      this.selectedMonsterEdit.indexMonster = monstersFound.monsters.indexOf(monsterFound);

      this.monsterEditedChanged.next(monsterFound);
    }
  }

}
