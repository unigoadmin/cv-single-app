import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { BaseService } from 'src/@shared/services/base.service';
import { environment } from 'src/environments/environment';
import { throwError as observableThrowError,Observable } from 'rxjs';
import { ErrorService } from 'src/@shared/services';
import {  SignUp } from '../models/signup';
import { ContactEnquiry, ResetPassword } from '../models';
import { identity_response } from 'src/@cv/models/apiresponse';


@Injectable({
  providedIn: 'root'
})

export class IdentityService extends BaseService {

  baseURI= environment.identityServerUrl+'api/identity/';
  constructor(private http: HttpClient,
    private _errorService: ErrorService) {    
    super();      
  }

  register(signUp: SignUp) {
    let headers = new HttpHeaders();
    headers =  headers.append("Content-Type", 'application/json');

    return this.http.post(this.baseURI + 'register', signUp,  { headers: headers })
        .pipe(map(responce => console.log(responce))
        ,catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));
   }

   sendResetUrlLink(emailId :string) {
      let headers = new HttpHeaders();
      headers =  headers.append("Content-Type", 'application/json');
    return this.http.post(this.baseURI + 'forgotpassword/'+emailId,null, { headers: headers })
        .pipe(map(responce => console.log(responce))
        ,catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));
    }

   verifyEmail(verficationId: string) {
    return this.http.get(this.baseURI + 'verifyemail/'+verficationId)
      .pipe(map(responce => console.log(responce))
      ,catchError((error: Response) => {
          let errorText = this._errorService.getErrorMessage(error);
          return observableThrowError(errorText);
      }));
   }
  

   reSendActivationLink(signUp: SignUp) {
    let headers = new HttpHeaders();
    headers =  headers.append("Content-Type", 'application/json');

    return this.http.post(this.baseURI + 'resendactivationlink', signUp,  { headers: headers })
      .pipe(map(responce => console.log(responce))
        , catchError((error: Response) => {
          let errorText = this._errorService.getErrorMessage(error);
          return observableThrowError(errorText);
        }));
   }

   resetPassword(resetPassword: ResetPassword):Observable<identity_response> {
    let headers = new HttpHeaders();
    headers =  headers.append("Content-Type", 'application/json');

    return this.http.post(this.baseURI + 'resetpassword', resetPassword, { headers: headers })
        .pipe(map(responce => <identity_response>responce)
        ,catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));
}

   saveContactRequest(contactEnquiry: ContactEnquiry) {     
    let headers = new HttpHeaders();
    headers =  headers.append("Content-Type", 'application/json');
 
   return this.http.post(this.baseURI + 'savecontactenquiry', contactEnquiry, { headers: headers })
       .pipe(map(responce => console.log(responce))
       ,catchError(error => { console.log(error); return observableThrowError(error); }));
  }

  SendCompanyActivationLink(signUp: SignUp) {
    let headers = new HttpHeaders();
    headers =  headers.append("Content-Type", 'application/json');

    return this.http.post(this.baseURI + 'SendCompanyActivationLink', signUp,  { headers: headers })
      .pipe(map(responce => console.log(responce))
        , catchError((error: Response) => {
          let errorText = this._errorService.getErrorMessage(error);
          return observableThrowError(errorText);
        }));
   }
 
}


