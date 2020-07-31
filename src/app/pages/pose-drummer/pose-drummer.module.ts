import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoseDrummerRoutingModule } from './pose-drummer-routing.module';
import { PoseDrummerComponent } from './pose-drummer/pose-drummer.component';
import { NgxJsonViewModule } from 'ng-json-view';
import { PoseTrainDataComponent } from './pose-train-data/pose-train-data.component';
import { CountdownComponent } from './countdown/countdown.component';

@NgModule({
  declarations: [PoseDrummerComponent, PoseTrainDataComponent, CountdownComponent],
  imports: [
    CommonModule,
    PoseDrummerRoutingModule,
    SharedModule,
    NgxJsonViewModule
  ],
  entryComponents: [
    PoseTrainDataComponent,
    CountdownComponent
  ]
})
export class PoseDrummerModule { }
