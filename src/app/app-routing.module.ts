import { NgModule } from '@angular/core';
import { Router, RouterModule, PreloadAllModules } from '@angular/router';
import { HomeComponent } from './core/home/home.component';
import { MonstersComponent } from './monsters/monsters.component';

const appRoutes = [
  { path: '', component: HomeComponent },
  { path: 'monsters', loadChildren: './monsters/monsters.module#MonstersModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})

export class AppRoutingModule {}
