import { CountdownService } from '@shared/services/countdown.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'fsx-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements OnInit {
  mode: 'create' | 'update' = 'create';

  // for Circle-Progress
  progressValue = 0;
  initialTime = 5;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private dialogRef: MatDialogRef<CountdownComponent>,
    private dialog: MatDialog,
    private countDownSV: CountdownService
  ) {

  }

  ngOnInit(): void {
    if (this.dialogData) {
      this.mode = 'update';

    } else {
      this.dialogData = {};
      this.mode = 'create';
    }
    this.countDownSV.getCountDown$().subscribe(
      t => {
        this.progressValue = t;
      },
      null,
      () => {
        // this.progressValue = 'Ready!';
        setTimeout(() => {
          this.closeDialog();
        }, 300);

      }
    );

    this.countDownSV.startCountDown(this.initialTime);

  }

  closeDialog() {
    this.onClear();
    this.dialogRef.close();
  }

  onClear(msg: String = '') {

  }

  onClose() {
    this.onClear();
    // this.dialogRef.close()
  }

  ngOnDestroy() {
  }

}
