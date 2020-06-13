import { Component, OnInit, ViewChild, HostBinding, ElementRef, Inject } from '@angular/core';
import { MatSidenav, MatSidenavContent, MatSidenavContainer } from '@angular/material/sidenav';
import { Subject, Subscription, BehaviorSubject, Observable } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { OverlayContainer } from '@angular/cdk/overlay';
import { AppThemeSwitcherService } from '@app/shared/services/app-theme.service';
import { tap, distinctUntilChanged, filter } from 'rxjs/operators';
import { ResponsiveLayoutService, BreakPointsEX } from '@fullstackx/responsive-layout';

@Component({
  selector: 'fsx-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutComponent implements OnInit {

  @ViewChild(MatSidenavContainer) sidenavContainer: MatSidenavContainer;
  @ViewChild('sidenav', { static: true }) sidenav: MatSidenav;
  @ViewChild('content', { static: true }) content: MatSidenavContent;

  appLayoutOptions = {
    sideNavMode: 'side',
    showHeader: true,
    headerPos: 'above',
    showSidePanel: true,
    sideNavOpened: true,
    sideNavCollapsed: false,
    theme: 'light',
    dir: 'ltr'
  };

  private _preserveBP$: BehaviorSubject<any> = new BehaviorSubject<any>('');
  private _sideNavWidth$: BehaviorSubject<{}> = new BehaviorSubject<{}>({});
  sideNavWidth$: Observable<{}> = this._sideNavWidth$.asObservable();

  private layoutChanges: Subscription;

  savedSideNavWidth;

  // local boolean for certain breakpoints
  isHandset: boolean = false;
  isTablet: boolean = false;
  isWeb: boolean = false;
  isXSmall: boolean = false;
  isSmall: boolean = false;
  isMedium: boolean = false;
  isLarge: boolean = false;
  isXLarge: boolean = false;



  get isOver(): boolean {
    return this.isXSmall;
  }

  private contentWidthFix = true;


  themeClass: BehaviorSubject<string>;

  constructor(
    private router: Router,
    private appThemeSwitcherSV: AppThemeSwitcherService,
    private layoutSV: ResponsiveLayoutService
  ) {

    this.appThemeSwitcherSV.setColorClass('custom-material-light-theme');
    this.themeClass = this.appThemeSwitcherSV.getColorClass();
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    /**
     *
     * Dynamic SideNav Width using Async pipe
     * Usage: [ngStyle]="_sideNavWidth$|async"
     *
    */
    setTimeout(() => {
      this.layoutChanges = this.layoutSV.observeBreakpoints().pipe(
      ).subscribe(
        result => {
          // console.log(" ==> AppLayoutComponent|result: ", result);
          this.isXSmall = this.isSmall = this.isMedium = this.isLarge = this.isXLarge = false;
          for (let matchedBP of result) {

            if (matchedBP === BreakPointsEX.XSmall) {
              this.isXSmall = true;
              // this._sideNavWidth$.next({ 'width': '50px' });
            } else if (matchedBP === BreakPointsEX.Small) {
              this._sideNavWidth$.next({ 'width': '90px' });
            } else if (matchedBP === BreakPointsEX.Medium) {
              this._sideNavWidth$.next({ 'width': '200px' });
            } else if (matchedBP === BreakPointsEX.Large) {
              this._sideNavWidth$.next({ 'width': '250px' });
            } else if (matchedBP === BreakPointsEX.XLarge) {
              this._sideNavWidth$.next({ 'width': '300px' });
            } else if (matchedBP === BreakPointsEX.XXLarge) {
              this._sideNavWidth$.next({ 'width': '300px' });
            }
          }
        }
      );
    }, 0);


    // this.sidenavContainer.scrollable.elementScrolled().subscribe(() => {
    //   /* react to scrolling */
    // });
  }

  // openedChange: Event emitted when the drawer open state is changed.
  sideNavOpenedChange(isOpened: boolean) {
    this.appLayoutOptions.sideNavOpened = isOpened;

  }

  // closedStart: Event emitted when the drawer has started closing.
  sideNavCloseStart() {
    this.contentWidthFix = false;
  }

  calcSideNavWidth() {

  }

  ngOnDestroy() {
    this.layoutChanges.unsubscribe();
  }

}
