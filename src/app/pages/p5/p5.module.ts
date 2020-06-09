import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { P5RoutingModule } from './p5-routing.module';
import { P5PlayComponent } from './p5-play/p5-play.component';


@NgModule({
  declarations: [P5PlayComponent],
  imports: [
    CommonModule,
    P5RoutingModule
  ]
})
export class P5Module { }
