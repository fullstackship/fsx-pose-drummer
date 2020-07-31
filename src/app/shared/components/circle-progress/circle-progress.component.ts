import { Component, OnInit, Input, ChangeDetectionStrategy, SimpleChange } from '@angular/core';

@Component({
  selector: 'fsx-circle-progress',
  templateUrl: './circle-progress.component.html',
  styleUrls: ['./circle-progress.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CircleProgressComponent implements OnInit {

  @Input() progressValue: number = 0;
  @Input() totalValue: number = 100;
  @Input() displayStyle: string = 'percentage'; // or countdown

  // 2PI * radius
  public circumference: number = 2 * Math.PI * 45;
  /**
   * The stroke-dashoffset attribute is a presentation attribute defining an offset on the rendering of the associated dash array.
   * @link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dashoffset
   *
   */
  public strokeDashOffset: number = 100;

  constructor() { }

  ngOnInit(): void {
    console.log("  --> progressValue: ", this.progressValue);
    console.log("  --> totalValue: ", this.totalValue);
    console.log("  --> displayStyle: ", this.displayStyle);
  }

  ngOnChanges(changes: SimpleChange) {
    console.log("  --> ngOnChanges : ", changes, changes['progressValue']);
    if (changes['progressValue']) {

      this.updateProgress(changes['progressValue'].currentValue);

    }
  }

  updateProgress(currValue: number) {
    let offset = 0;
    if (this.displayStyle === 'percentage') {
      offset = this.circumference - (currValue / 100) * this.circumference;
    } else if (this.displayStyle === 'countdown') {
      offset = this.circumference - ((( (this.totalValue - currValue) / this.totalValue)) * this.circumference);
    }

    console.log("  --> offset: ", offset);

    this.strokeDashOffset = offset;
  }



}
