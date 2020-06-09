import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { auth } from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';

import { Observable, of, BehaviorSubject } from 'rxjs';
import { switchMap, startWith, tap, filter, first, take, shareReplay, map, distinctUntilChanged } from 'rxjs/operators';
import { NotifyService } from '@app/core/services/notify.service';
import { FireUser } from '@app/core/models/firebase/fireuser';
import { Logger } from '@app/shared/services/logger.service';
import { CommonFireService } from './common.fire.service';



@Injectable()
export class AuthFireService {
  private user$: Observable<FireUser | null>;
  private signInedUser: FireUser;
  // private isAuth$ = false;
  private isAuth$ = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuth$.asObservable();

  constructor(
    private fireSV: CommonFireService,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private notify: NotifyService,
    private zone: NgZone,
    private logger: Logger
  ) {

    // To Many occurs
    // this.afAuth.onAuthStateChanged((user) => {
    //   this.logger.log(" --> onAuthStateChanged: ", user);
    // });


    // TODO: signInedUser is unstable
    // this.user$ = this.afAuth.authState.pipe(
    //   // tap(user => this.logger.log('user from authState: ', user)),
    //   take(1),
    //   distinctUntilChanged(),
    //   switchMap(user => {
    //     if (user) {
    //       this.signInedUser = this.makeUserObj(user);
    //       this.logger.log("  --> switchMap/signInedUser: ", this.signInedUser);
    //       const fUser$ = this.afs.doc<FireUser>(`users/${this.signInedUser.uid}`).valueChanges();
    //       return fUser$.pipe(
    //         tap(u => this.logger.log("  --> fUser: ", u)),
    //         map(u => u)
    //       );

    //     } else {
    //       return of(null);
    //     }
    //   }),
    //   shareReplay(1)
    // );

    this.checkAuthenticated();
  }

  // Checks whether a user session exists
  checkAuthenticated() {
    // TODO
    this.authedUser().subscribe(
      user => {
        console.log("checkAuthenticated|user: ", user);
        if (user) {
          this.isAuth$.next(true);
        }
      }
    );
  }


  getCurrentUser$() {
    return this.afAuth.currentUser;
  }

  authedUser() {
    return this.afAuth.authState.pipe(first());
  }

  // Sets user$ data to firestore after succesful login
  private updateUserData(user: FireUser) {

    const fireUser: FireUser = {
      uid: user.uid,
      data: {
        email: user.data.email || null,
        displayName: user.data.displayName || 'nameless user',
        photoURL: user.data.photoURL || ''
      }
    };

    if (user) {
      this.logger.log("  -->updateUserData: ", user);

      const userRef = this.afs.doc<FireUser>(`users/${user.uid}`);
      //return userRef.set(fireUser, { merge: true }); //Destructively updates { merge: true } option
      return this.fireSV.upsert(`users/${user.uid}`, fireUser);

    } else {
      this.signOut(); // Is It really necessary?
    }
  }



  private doSignInAndUpdateUserData(provider: any) {


    return this.afAuth
      .signInWithPopup(provider)
      .then(credential => {
        this.logger.log("  --> signIn Success: ", credential);
        this.notify.update('Welcome to Firebase!', 'success');
        this.isAuth$.next(true);
        return this.updateUserData(this.makeUserObj(credential.user));
      })
      .catch(error => this.handleError(error));

  }

  makeUserObj(u): FireUser {
    const user = {
      uid: u.uid,
      data: u
    };
    delete user.data.uid;
    return user;
  }



  googleSingin() {
    const provider = new auth.GoogleAuthProvider();
    return this.doSignInAndUpdateUserData(provider);
  }

  githubSignin() {
    const provider = new auth.GithubAuthProvider();
    return this.doSignInAndUpdateUserData(provider);
  }

  facebookSignin() {
    const provider = new auth.FacebookAuthProvider();
    return this.doSignInAndUpdateUserData(provider);
  }

  twitterSignin() {
    const provider = new auth.TwitterAuthProvider();
    return this.doSignInAndUpdateUserData(provider);
  }



  // Anonymous Auth : Not using now
  anonymousSignin() {
    return this.afAuth
      .signInAnonymously()
      .then(credential => {
        this.notify.update('Welcome to Firestarter!!!', 'success');
        {
          credential.user;
          return this.updateUserData(this.makeUserObj(credential.user)); // if using firestore
        }
      })
      .catch(error => {
        this.handleError(error);
      });
  }

  // Email/Password Auth
  emailSignUp(email: string, password: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then(credential => {
        this.notify.update('Welcome new user!', 'success');
        return this.updateUserData(this.makeUserObj(credential.user)); // if using firestore
      })
      .catch(error => this.handleError(error));
  }

  emailLogin(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then(credential => {
        this.notify.update('Welcome back!', 'success');
        return this.updateUserData(this.makeUserObj(credential.user));
      })
      .catch(error => this.handleError(error));
  }

  // Sends email allowing user to reset password
  resetPassword(email: string) {
    const fbAuth = auth();

    return fbAuth
      .sendPasswordResetEmail(email)
      .then(() => this.notify.update('Password update email sent', 'info'))
      .catch(error => this.handleError(error));
  }

  async signOut(redirect?: string) {
    try {
      await this.afAuth.signOut();
      this.isAuth$.next(false);
      if (redirect) {
        this.router.navigate([redirect]);
      }

    } catch (err) {
      this.logger.log('err');
    } finally {
      this.router.navigate(['/home']);
    }

  }

  // If error, console log and notify user
  private handleError(error: Error) {
    console.error(error);
    this.notify.update(error.message, 'error');
  }


}
