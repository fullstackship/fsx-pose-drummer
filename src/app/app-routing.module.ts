import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { HomeLayoutComponent } from './pages/layout/home-layout/home-layout.component'

const homeChilrdrenRoutes: Routes = [
  {
    path: '',
    redirectTo: 'p5',
    pathMatch: 'full'
  },
  {
    path: 'p5',
    loadChildren: () => import('./pages/p5/p5.module').then(mod => mod.P5Module)
  },

]



const routes: Routes = [

  {
    path: '',
    // component: HomeLayoutComponent,
    children: homeChilrdrenRoutes
  },
  // {
  //   path: 'admin',
  //   loadChildren: () => import('./pages/admin/admin.module').then(mod => mod.AdminModule)
  // }

]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
