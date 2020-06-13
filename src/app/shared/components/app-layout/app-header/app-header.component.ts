import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AppThemeSwitcherService } from '@app/shared/services/app-theme.service';
import { ThemePalette } from '@angular/material/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { tap, map } from 'rxjs/operators';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { AuthFireService } from '@app/core/services/firebase/fire.auth.service';

@Component({
  selector: 'fsx-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class AppHeaderComponent implements OnInit {

  @Input() showToggle = true;
  @Input() showLogo = false;

  @Output() toggleSidenav = new EventEmitter<void>();

  isAuthenticated$: Observable<boolean>;

  slideThemeColor: ThemePalette = 'accent';

  currTheme;

  constructor(
    private dialog: MatDialog,
    private authFireSV: AuthFireService,
    private router: Router,
    private route: ActivatedRoute,
    private appThemeSwitcherSV: AppThemeSwitcherService
  ) {

    this.isAuthenticated$ = this.authFireSV.isAuthenticated$;
    this.authFireSV.isAuthenticated$.subscribe(b => {
    });

    this.appThemeSwitcherSV.getColorClass().subscribe(
      themeTitle => {
        this.currTheme = themeTitle;
      }
    );
  }

  ngOnInit() {

  }

  onSlideToggleChange() {

    if (this.currTheme === 'custom-material-light-theme') {
      this.appThemeSwitcherSV.setColorClass('custom-material-dark-theme');
    } else if (this.currTheme === 'custom-material-dark-theme') {
      this.appThemeSwitcherSV.setColorClass('custom-material-light-theme');
    }

  }

  onSignOut() {
    this.authFireSV.signOut();
  }

}
