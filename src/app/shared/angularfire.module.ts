import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { environment } from '@environment'

//Firebase
import { AngularFirestoreModule } from '@angular/fire/firestore'
import { AngularFireStorageModule } from '@angular/fire/storage'
import { AngularFireAuthModule } from '@angular/fire/auth'
import { AngularFireMessagingModule } from '@angular/fire/messaging'
import { AngularFireFunctionsModule } from '@angular/fire/functions'


const SHARED_MODULES = [

  AngularFirestoreModule, // imports firebase/firestore, only needed for database features
  AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
  AngularFireStorageModule,  // imports firebase/storage only needed for storage features
  AngularFireMessagingModule,
  AngularFireFunctionsModule,
]

const SHARED_COMPONENTS = [

]

const SHARED_PIPES = [

]

@NgModule({
  imports: [
    CommonModule,
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
  entryComponents: [],
  providers: [
  ]
})
export class AngularFirebaseModule { }
