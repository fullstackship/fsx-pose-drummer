import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MediaRoutingModule } from './media-routing.module';
import { SoundUploaderComponent } from './sound-uploader/sound-uploader.component';
import { SoundManagerComponent } from './sound-manager/sound-manager.component';


@NgModule({
  declarations: [SoundUploaderComponent, SoundManagerComponent],
  imports: [
    CommonModule,
    MediaRoutingModule,
    SharedModule
  ]
})
export class MediaModule { }
