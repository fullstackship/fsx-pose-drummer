import { Input, OnInit, Component } from '@angular/core';
import { Subject, Observable, Subscription, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { tap, distinctUntilChanged } from 'rxjs/operators';
import { ResponsiveLayoutService, BreakPointsEX } from '@fullstackx/responsive-layout';


@Component({
  selector: 'fsx-app-sidebar',
  templateUrl: './app-sidebar.component.html',
  styleUrls: ['./app-sidebar.component.scss']
})
export class AppSidebarComponent implements OnInit {
  @Input() showSidePanel = true;
  @Input() showHeader = true;
  @Input() isMobile: boolean = false;

  private layoutChanges: Subscription;

  isSmall$ = new Subject<boolean>();

  _sidebarClass$: Subject<unknown> = new Subject<unknown>();
  sidebarClass$: Observable<unknown> = this._sidebarClass$.asObservable();


  constructor(
    private appLayoutSV: ResponsiveLayoutService,
    private router: Router,
    private route: ActivatedRoute,
  ) {


  }

  ngOnInit() { }

  ngAfterViewInit() {

    setTimeout(() => {
      this.layoutChanges = this.appLayoutSV.observeBreakpoints().pipe(


      ).subscribe(
        result => {
          console.log(" ==> AppSidebarComponent|result: ", result);
          for (let matchedBP of result) {

            if (matchedBP === BreakPointsEX.XSmall) {
              // this.isSmall$.next(true);
            } else if (matchedBP === BreakPointsEX.Small) {
              // this._sidebarClass$.next(['small-sidebar']);
              this.isSmall$.next(true);
            } else if (matchedBP === BreakPointsEX.Medium) {
              this.isSmall$.next(false);
              this._sidebarClass$.next(['medium-sidebar']);
            } else if (matchedBP === BreakPointsEX.Large) {
              this.isSmall$.next(false);
              this._sidebarClass$.next(['large-sidebar']);
            } else if (matchedBP === BreakPointsEX.XLarge) {
              this.isSmall$.next(false);
              this._sidebarClass$.next(['wider-sidebar']);
            } else if (matchedBP === BreakPointsEX.XXLarge) {
              this.isSmall$.next(false);
              this._sidebarClass$.next(['wider-sidebar']);
            }
          }
        }
      );
    }, 0);


  }

  ngOnDestroy(): void {

    if (this.layoutChanges != null) {
      this.layoutChanges.unsubscribe();
    }
  }

}
