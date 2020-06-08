import { NgModule, ModuleWithProviders } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'

import { ErrorComponent } from './components/error/error.component'
import { DropzoneDirective } from './components/dropzone/dropzone.directive'

import { ToolbarComponent } from './components/toolbar/toolbar.component'
import { MaterialModule } from './material.module'
import { AngularFirebaseModule } from './angularfire.module'


const SHARED_MODULES = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  RouterModule,
  MaterialModule,
  AngularFirebaseModule,


]

const SHARED_COMPONENTS = [
  ErrorComponent,
  DropzoneDirective,
  ToolbarComponent,
]

const SHARED_PIPES = [
]

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
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [

      ],
    }
  }
}
