// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl: 'http://localhost:4200',

  firebase: {
    apiKey: "AIzaSyCCkseMtiz9qAgz_YgQmE4R9WXxUqLkTsU",
    authDomain: "fullstackx-dev.firebaseapp.com",
    databaseURL: "https://fullstackx-dev.firebaseio.com",
    projectId: "fullstackx-dev",
    storageBucket: "fullstackx-dev.appspot.com",
    messagingSenderId: "742091847510",
    appId: "1:742091847510:web:ff3da8b905c92ffb2888f7",
    measurementId: "G-G6WYW40NX4"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
