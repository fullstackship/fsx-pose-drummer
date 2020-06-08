import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { auth } from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap, startWith, tap, filter, first, take, shareReplay, map, distinctUntilChanged } from 'rxjs/operators';
import { NotifyService } from '@app/core/services/notify.service';
import { FireService } from '@app/core/services/firebase/fire.service';
import { FireUser } from '@app/core/models/firebase/fireuser';



@Injectable()
export class FirebaseAuthService {
  user$: Observable<FireUser | null>;
  signInedUser: FireUser;
  private isAuthenticated = false;

  constructor(
    private fireSV: FireService,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private notify: NotifyService,
    private zone: NgZone
  ) {

    // To Many occurs
    // this.afAuth.auth.onAuthStateChanged((user) => {
    //   console.log(" --> onAuthStateChanged: ", user);
    // });


    // TODO: signInedUser is unstable
    this.user$ = this.afAuth.authState.pipe(
      // tap(user => console.log('user from authState: ', user)),
      first(),
      distinctUntilChanged(),
      switchMap(user => {
        if (user) {
          this.signInedUser = this.makeUserObj(user);
          console.log("  --> switchMap/signInedUser: ", this.signInedUser);
          const fUser$ = this.afs.doc<FireUser>(`users/${this.signInedUser.uid}`).valueChanges();
          return fUser$.pipe(
            tap(u => console.log("  --> fUser: ", u)),
            map(u => u)
          );

        } else {
          return of(null);
        }
      }),
      shareReplay(1)
    );

  }

  getSignInedUser() {
    return this.signInedUser;
  }

  getUser$() {
    return this.user$;
  }

  getCurrentUser() {
    return this.afAuth.auth.currentUser;
  }

  isLoggedIn() {
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
      console.log("  -->updateUserData: ", user);
      console.log("  -->isLoggedIn? ", this.isLoggedIn());

      const userRef = this.afs.doc<FireUser>(`users/${user.uid}`);
      //return userRef.set(fireUser, { merge: true }); //Destructively updates { merge: true } option
      return this.fireSV.upsert(`users/${user.uid}`, fireUser);

    } else {
      // Is It really necessary?
      this.signOut();
    }
  }



  private doSignInAndUpdateUserData(provider: any) {

    // this.zone.runOutsideAngular(() => {
    //   return this.afAuth.auth
    //     .signInWithPopup(provider)
    //     .then(credential => {
    //       // this.notify.update('Welcome to Firebase!', 'success');
    //       console.log("  --> signIn Success: ", credential);
    //       this.isAuthenticated = true;
    //       return this.updateUserData(this.makeUserObj(credential.user));
    //     })
    //     .catch(error => this.handleError(error));
    // });


    return this.afAuth.auth
      .signInWithPopup(provider)
      .then(credential => {
        console.log("  --> signIn Success: ", credential);
        this.notify.update('Welcome to Firebase!', 'success');
        this.isAuthenticated = true;
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



  googleLogin() {
    const provider = new auth.GoogleAuthProvider();
    return this.doSignInAndUpdateUserData(provider);
  }

  githubLogin() {
    const provider = new auth.GithubAuthProvider();
    return this.doSignInAndUpdateUserData(provider);
  }

  facebookLogin() {
    const provider = new auth.FacebookAuthProvider();
    return this.doSignInAndUpdateUserData(provider);
  }

  twitterLogin() {
    const provider = new auth.TwitterAuthProvider();
    return this.doSignInAndUpdateUserData(provider);
  }



  // Anonymous Auth
  anonymousLogin() {
    return this.afAuth.auth
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
    return this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(credential => {
        this.notify.update('Welcome new user!', 'success');
        return this.updateUserData(this.makeUserObj(credential.user)); // if using firestore
      })
      .catch(error => this.handleError(error));
  }

  emailLogin(email: string, password: string) {
    return this.afAuth.auth
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

  signOut() {
    return this.afAuth.auth.signOut();
    // this.afAuth.auth.signOut().then(() => {
    //   this.router.navigate(['/']);
    // });
  }

  // If error, console log and notify user
  private handleError(error: Error) {
    console.error(error);
    this.notify.update(error.message, 'error');
  }


}
