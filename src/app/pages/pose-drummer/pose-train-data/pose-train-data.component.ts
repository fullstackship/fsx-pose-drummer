import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectionStrategy, SimpleChanges, OnChanges, ChangeDetectorRef } from '@angular/core';
import { DynamicComp } from '../dynamicComp';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { CountdownComponent } from '../countdown/countdown.component';
import { NotificationService } from '@app/shared/services/notification.service';

@Component({
  selector: 'fsx-pose-train-data',
  templateUrl: './pose-train-data.component.html',
  styleUrls: ['./pose-train-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoseTrainDataComponent implements OnInit, OnChanges, DynamicComp {

  @Output() event = new EventEmitter<{}>();

  @Input()
  set capturedImage(capturedImage: any) {
    // console.log("capturedImage: ", capturedImage);
    this.capturedImages.push(capturedImage);
    this.cd.detectChanges();
  }

  capturedImages: Array<any> = [];
  targetLabel;

  uid = "Comp-" + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);

  constructor(
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private notiSV: NotificationService
  ) { }

  ngOnInit(): void {
  }


  // Doesn't work with Dynamic Component method
  ngOnChanges(changes: SimpleChanges): void {
    // console.log("PoseTrainDataComponent|ngOnChanges: ", changes.capturedImage);

    if (changes.capturedImage.currentValue !== undefined) {
      this.capturedImages.push(changes.capturedImage.currentValue);
    }
  }

  startCoundownPopup() {
    const dialogConfig: MatDialogConfig = {
      panelClass: 'my-dialog-panel',
      disableClose: false,
      autoFocus: true,

      minWidth: '350px',
      // Set maxWidht,maxHeight to 100vw,100vh to prevent shrinking
      maxWidth: '60vw',
      maxHeight: '60vh',
      // for full screen
      // height: '70%',
      // width: '80%'
    };
    this.notiSV.warn("Get Ready for training data!");
    this.dialog.open(CountdownComponent, dialogConfig).afterClosed().subscribe((item: any) => {
      this.notiSV.warn("Are you Ready?")
      setTimeout(() => {
        this.startAutoCollectData();
      }, 2000);

    });
  }

  startAutoCollectData() {
    this.event.emit({ 'uid': this.uid, 'targetLabel': this.targetLabel });
  }

}
