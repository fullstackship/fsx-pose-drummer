import { Component, OnInit } from '@angular/core';
import { CdkDragStart } from '@angular/cdk/drag-drop';

@Component({
  selector: 'fsx-fixed-drag-btn',
  templateUrl: './fixed-drag-btn.component.html',
  styleUrls: ['./fixed-drag-btn.component.scss']
})
export class FixedDragBtnComponent implements OnInit {
  dragging = false;

  constructor() { }

  dragStart(event: CdkDragStart): void {
    this.dragging = true;
  }

  openEditorDialog(event: MouseEvent) {
    if (this.dragging) {
      this.dragging = false;
      return;
    }
  }

  ngOnInit(): void {
  }

}
