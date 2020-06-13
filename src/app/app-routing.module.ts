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
  },
  {
    path: 'p5',
    loadChildren: () => import('./pages/p5/p5.module').then(mod => mod.P5Module)
  },
];


const routes: Routes = [

  {
    path: '',
    // component: HomeLayoutComponent,
    children: userPagesRoutes
  },
  // {
  //   path: 'admin',
  //   loadChildren: () => import('./pages/admin/admin.module').then(mod => mod.AdminModule)
  // }

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
