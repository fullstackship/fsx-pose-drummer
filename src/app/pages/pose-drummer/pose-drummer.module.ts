import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoseDrummerRoutingModule } from './pose-drummer-routing.module';
import { PoseDrummerComponent } from './pose-drummer/pose-drummer.component';
import { NgxJsonViewModule } from 'ng-json-view';

@NgModule({
  declarations: [PoseDrummerComponent],
  imports: [
    CommonModule,
    PoseDrummerRoutingModule,
    SharedModule,
    NgxJsonViewModule
  ]
})
export class PoseDrummerModule { }
