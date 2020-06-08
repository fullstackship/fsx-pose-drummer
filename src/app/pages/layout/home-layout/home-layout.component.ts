import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { AppSettings, Settings } from '@app/app.settings'

@Component({
  selector: 'app-home-layout',
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.scss']
})
export class HomeLayoutComponent implements OnInit {
  public settings: Settings

  constructor(public appSettings: AppSettings, public router: Router) {
    this.settings = this.appSettings.settings
  }

  ngOnInit() {
  }

}
