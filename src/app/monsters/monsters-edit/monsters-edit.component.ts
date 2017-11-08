import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

import { Monster } from '../monster.model';
import { MonstersService } from '../monsters.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-monsters-edit',
  templateUrl: './monsters-edit.component.html',
  styleUrls: ['./monsters-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class MonstersEditComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  monsterForm: FormGroup;
  monster: Monster;
  pageMode = {
    edit: {
      title: 'Edit monster',
      sumbmitButton: 'Save'
    },
    new: {
      title: 'Create new monster',
      sumbmitButton: 'Create'
    }
  };
  pageData = this.pageMode.new;
  editMode = false;
  monstersType;
  monstersTypesNames = this.monstersService.getMonstersTypesNames();
  id = null;

  constructor(private monstersService: MonstersService,
              private route: ActivatedRoute,
              private router: Router) {}



  ngOnInit() {
    this.monstersType = this.route.snapshot.params['name'];
    this.id = +this.route.snapshot.params['id'];
    if (this.route.snapshot.params['id']) {
      this.editMode = true;
      this.pageData = this.pageMode.edit;
      this.initForm();
      this.subscription = this.monstersService.monsterEditedChanged
      .subscribe((monster) => {
        if (monster) {
          this.monster = monster;
          this.initForm();
        }
      });
      this.monstersService.sendMonsterToEdit(this.id, this.monstersType);
    } else {
      this.editMode = false;
      this.pageData = this.pageMode.new;
      this.initForm();
    }
  }

  private initForm() {
    let monsterName = '';
    let monsterStrenght = 0;
    let monsterAge = 0;
    let monsterType = '';

    if (this.editMode && this.monster) {
      monsterName = this.monster.name;
      monsterStrenght = this.monster.strenght;
      monsterAge = this.monster.age;
      monsterType = this.monster.type;
    }

    this.monsterForm = new FormGroup({
      'name': new FormControl(monsterName, Validators.required),
      'strenght': new FormControl(monsterStrenght, Validators.compose([Validators.required, maxValue(100), minValue(0)])),
      'age': new FormControl(monsterAge, Validators.required),
      'type': new FormControl({value: monsterType, disabled: this.editMode}, Validators.required)
    });
  }

  onSubmit() {
    if (this.editMode) {
      this.monstersService.updateMonster(this.monsterForm.value);
    } else {
      this.monstersService.addMonster(this.monsterForm.value);
    }
    this.onCancel();
  }

  onCancel() {
    let linkGo = '/';
    const link = this.route.snapshot.params['linkBack'];
    if (link) {
      linkGo = link.slice(
        link.indexOf('/monsters'),
        link.length
      );
      this.router.navigate([linkGo]);
    } else {
      const monstersType = this.monstersTypesNames.find( name => name === this.monsterForm.value['type']) ;
      if (monstersType) {
        this.router.navigate(['/monsters/' + monstersType + '/page/0']);
      } else {
        this.router.navigate([linkGo]);
      }
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}



function maxValue(max: Number): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    const input = control.value,
          isValid = input > max;
    if (isValid) {
      return { 'maxValue': {max} };
    } else {
      return null;
    }
  };
}

function minValue(min: Number): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    const input = control.value,
          isValid = input < min;
    if (isValid) {
      return { 'minValue': {min} };
    } else {
      return null;
    }
  };
}
