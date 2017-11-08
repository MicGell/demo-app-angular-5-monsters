import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MonstersService } from '../monsters/monsters.service';
import { Monster } from '../monsters/monster.model';

@Injectable()
export class DataStorageService {
  constructor(private httpClient: HttpClient,
              private monstersService: MonstersService) {}


  getMonsters() {
    const monstersArray = this.monstersService.getMonstersArray();
    monstersArray.forEach((monsters, index) => {
      if (monsters.hrefData && monsters.hrefData !== 'none' ) {
        this.httpClient.get<Monster[]>(monsters.hrefData)
        .subscribe(
          monstersHttp => {
            const newMonsters = monstersHttp.map((monster) => {
              if (!monster['type']) {
                monster['type'] = monsters.type;
              }
              return monster;
            });
            this.monstersService.updateService(newMonsters, index, monsters.type);
          },
          err => {
            console.log('Something went wrong!', err);
          }
        );
      }
    });
  }
}
