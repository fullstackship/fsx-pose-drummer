import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectionStrategy, SimpleChanges, OnChanges, ChangeDetectorRef } from '@angular/core';
import { DynamicComp } from '../dynamicComp';

@Component({
  selector: 'app-pose-train-data',
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

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
  }


  // Doesn't work with Dynamic Component method
  ngOnChanges(changes: SimpleChanges): void {
    // console.log("PoseTrainDataComponent|ngOnChanges: ", changes.capturedImage);

    if (changes.capturedImage.currentValue !== undefined) {
      this.capturedImages.push(changes.capturedImage.currentValue);
    }
  }

  startAutoCollectData() {
    this.event.emit({ 'uid': this.uid, 'targetLabel': this.targetLabel });
  }

}
