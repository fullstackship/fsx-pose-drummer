import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { NotificationService } from '@app/shared/services/notification.service';
import { FirebaseAuthService } from '@app/core/services/firebase/fire.auth.service';

@Injectable({ providedIn: 'root' })
export class FireAuthGuard implements CanActivate {
  constructor(
    private fireUserSV: FirebaseAuthService,
    private afAuth: AngularFireAuth,
    private notiSV: NotificationService,
    private router: Router) { }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {

    // const currUser = await this.afAuth.auth.currentUser;
    const currUser = await this.fireUserSV.getUser$();
    console.log("  --> auth.currentUser: ", currUser);
    const isAuth = !!currUser;
    if (!isAuth) {
      this.notiSV.authIssue('Please Do SignIn');
      this.router.navigate(['/auth/fsignin']);
    }
    return isAuth;
  }
}
