import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'PoseDrummer';
  showApppLayout = false;

  constructor(public router: Router) {

  }

  ngOnInit() {
    this.router.events.subscribe((event) => {

      if (event instanceof NavigationEnd) {
        console.log(" AppComponent-constructor | event.url: ", event.url);
        if (event.url.startsWith('/landing')) {
          this.showApppLayout = false;
        } else {
          this.showApppLayout = true;
        }
      }
    });
  }
}
