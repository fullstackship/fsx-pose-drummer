import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeLayoutComponent } from './pages/layout/home-layout/home-layout.component';

const userPagesRoutes: Routes = [
  {
    path: '',
    redirectTo: 'pose',
    pathMatch: 'full'
  },
  {
    path: 'pose',
    loadChildren: () => import('./pages/pose-drummer/pose-drummer.module').then(mod => mod.PoseDrummerModule)
  }
];


const routes: Routes = [

  {
    path: '',
    // component: HomeLayoutComponent,
    children: userPagesRoutes
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      // { enableTracing: true } // <-- debugging purposes only
    )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
