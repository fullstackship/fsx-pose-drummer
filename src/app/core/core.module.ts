
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/rest/auth.service';
import { NotifyService } from './services/notify.service';
import { AuthFireService } from './services/firebase/fire.auth.service';
import { CommonFireService } from './services/firebase/common.fire.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    AuthService,
    NotifyService,
    //Firebase
    CommonFireService,
    AuthFireService,
  ]
})
export class CoreModule { }
