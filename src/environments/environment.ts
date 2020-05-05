// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase : {
    apiKey: "AIzaSyC4pTBwEQ5fVuStF1FtFLeLtTswvUYB5a4",
    authDomain: "tifiwebapp.firebaseapp.com",
    databaseURL: "https://tifiwebapp.firebaseio.com",
    projectId: "tifiwebapp",
    storageBucket: "tifiwebapp.appspot.com",
    messagingSenderId: "882165751714",
    appId: "1:882165751714:web:e8939fcbe5ede7ad405cfb"
  },

  // UrlBase:"https://tifi.herokuapp.com/",
  // UrlBase:"https://tifi.herokuapp.com/",
  // UrlBaseSocket:"http://localhost:5000", no es necesario con los nuevos cambios
  UrlBase:"http://localhost:5000/",
  //https://tifi.herokuapp.com/

  IVA: 0.19
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
