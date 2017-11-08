import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MonstersComponent } from './monsters.component';
import { MonstersEditComponent } from './monsters-edit/monsters-edit.component';
import { MonstersListComponent } from './monsters-list/monsters-list.component';
import { MonstersRoutingModule } from './monsters-routing.module';

@NgModule({
  declarations: [
    MonstersComponent,
    MonstersEditComponent,
    MonstersListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MonstersRoutingModule
  ]
})
export class MonstersModule { }
