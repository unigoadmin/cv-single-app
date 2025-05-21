// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  //Identity Server
  identityServerUrl: 'http://localhost:5000/',
  APIServerUrl: 'http://localhost:5050/api/',
  TASKAPIURL:'http://localhost:54160/api/',
  // identityServerUrl:'https://devaccounts.consultvite.com/',
  // APIServerUrl:'https://devapi.consultvite.com/api/',
  adminAppUrl:'http://localhost:4201/',
  //Public App Url
  publicAppUrl: 'http://localhost:4200/',
  //Admin App Url
  superadminAppUrl:'http://localhost:4201/',
  //ATS App Url
  atsAppUrl:'http://localhost:4202/',
  //Employee Central App Url
  employeecentralAppUrl:'http://localhost:4203/',
   //Docvault App Url
   docvaultAppUrl:'http://localhost:4204/',
  
  LoginUserKeyName: 'loginUser',
  RedirectionUrlKeyName: 'redirectUrl',
  FormPermissionsKeyName:'CV_FORM_PERMISSIONS',
  cvHomePage:'http://localhost:4200/#/dashboard',
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
