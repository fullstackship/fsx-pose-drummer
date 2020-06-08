import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/rest/auth.service';
import { NotifyService } from './services/notify.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    AuthService,
    NotifyService,
    //Firebase
    FirebaseAuthService,
  ]
})
export class CoreModule { }
