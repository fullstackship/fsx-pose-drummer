import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { AppLayoutComponent } from './app-layout.component';
import { AppHeaderComponent } from './app-header/app-header.component';
import { AppSidebarComponent } from './app-sidebar/app-sidebar.component';
import { SidemenuComponent } from './sidemenu/sidemenu.component';
import { SidePanelComponent } from './side-panel/side-panel.component';
import { SharedModule } from '@app/shared/shared.module';

const SHARED_COMPONENTS = [
  AppLayoutComponent,
  ToolbarComponent,
  AppHeaderComponent,
  AppSidebarComponent,
  SidemenuComponent,
  SidePanelComponent,
];


@NgModule({
  declarations: [
    ...SHARED_COMPONENTS
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    ...SHARED_COMPONENTS
  ]
})
export class AppLayoutModule { }
