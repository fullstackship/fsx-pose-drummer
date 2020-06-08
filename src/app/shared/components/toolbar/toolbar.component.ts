import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core'

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent implements OnInit {
  @Input() sidenav
  @Input() sidebar
  @Input() drawer
  @Input() matDrawerShow

  searchOpen: boolean = false;
  constructor() { }

  ngOnInit() {
  }
}
