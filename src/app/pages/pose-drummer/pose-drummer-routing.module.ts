
import { PoseDrummerComponent } from './pose-drummer/pose-drummer.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'drummer',
    pathMatch: 'full'
  },
  {
    path: 'drummer',
    component: PoseDrummerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PoseDrummerRoutingModule { }
