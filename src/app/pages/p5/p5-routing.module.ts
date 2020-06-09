import { P5PlayComponent } from './p5-play/p5-play.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
     path: '',
     redirectTo: 'p5-play',
     pathMatch: 'full'
  },
  {
     path: 'p5-play',
     component: P5PlayComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class P5RoutingModule { }
