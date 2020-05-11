// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyBIijq_OeJTy1RpKrSgsbt7LC7E0pMElBA",
    authDomain: "tifiweb.firebaseapp.com",
    databaseURL: "https://tifiweb.firebaseio.com",
    projectId: "tifiweb",
    storageBucket: "tifiweb.appspot.com",
    messagingSenderId: "505010110029",
    appId: "1:505010110029:web:6c833903b1c06d938da604",
    measurementId: "G-MHFJRC1QX5"
  },

  //UrlBase: "https://tifi.herokuapp.com/",
  UrlBase: "https://tifibackend.herokuapp.com/",
  // UrlBaseSocket:"http://localhost:5000", no es necesario con los nuevos cambios
  // UrlBase:"http://localhost:5000/", 
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
