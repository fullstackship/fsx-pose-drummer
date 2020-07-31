import { Logger } from '@app/shared/services/logger.service';
import { AppThemeSwitcherService } from '@app/shared/services/app-theme.service';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ErrorComponent } from './components/error/error.component';

import { MaterialModule } from './material.module';
import { AngularFirebaseModule } from './angularfire.module';
import { AnchorDirective } from './components/anchor.directive';
import { FixedDragBtnComponent } from './components/fixed-drag-btn/fixed-drag-btn.component';
import { CircleProgressComponent } from './components/circle-progress/circle-progress.component';


const SHARED_MODULES = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  RouterModule,
  MaterialModule,
  AngularFirebaseModule,


];

const SHARED_COMPONENTS = [
  ErrorComponent,
  AnchorDirective,
  FixedDragBtnComponent,
  CircleProgressComponent
];

const SHARED_PIPES = [
];

@NgModule({
  imports: [
    ...SHARED_MODULES,
  ],
  declarations: [
    ...SHARED_COMPONENTS,
    ...SHARED_PIPES,

  ],
  exports: [
    ...SHARED_MODULES,
    ...SHARED_COMPONENTS,
    ...SHARED_PIPES,
  ],
  entryComponents: [

  ],
  providers: [
    Logger,
    AppThemeSwitcherService
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [

      ],
    };
  }
}
