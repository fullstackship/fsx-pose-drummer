import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { HomeLayoutComponent } from './modules/layout/home-layout/home-layout.component'

const homeChilrdrenRoutes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./modules/home/home.module').then(mod => mod.HomeModule)
  },

]



const routes: Routes = [

  {
    path: '',
    component: HomeLayoutComponent,
    children: homeChilrdrenRoutes
  },
  // {
  //   path: 'admin',
  //   loadChildren: () => import('./modules/admin/admin.module').then(mod => mod.AdminModule)
  // }

]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
