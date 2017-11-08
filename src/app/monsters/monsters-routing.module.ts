import { NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { MonstersComponent } from './monsters.component';
import { MonstersListComponent } from './monsters-list/monsters-list.component';
import { MonstersEditComponent } from './monsters-edit/monsters-edit.component';

const mostersRoutes = [
  { path: '', component: MonstersComponent, children: [
    { path: 'new', component: MonstersEditComponent },
    { path: ':name/page/:numberPage', component: MonstersListComponent },
    { path: ':name/:id/edit', component: MonstersEditComponent }
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(mostersRoutes)],
  exports: [RouterModule]
})

export class MonstersRoutingModule {}

