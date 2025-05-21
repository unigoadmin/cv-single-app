import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { BaseService } from 'src/@shared/services/base.service';
import { environment } from 'src/environments/environment';
import { throwError as observableThrowError,Observable } from 'rxjs';
import { ErrorService } from 'src/@shared/services';
import { CompanyModules, ConsultviteUser, ResetPassword, UserSecurity } from '../models';


@Injectable({
  providedIn: 'root'
})

export class UserService extends BaseService {

  baseURI= environment.APIServerUrl+'users';
  constructor(private http: HttpClient,
    private _errorService: ErrorService) {    
    super();      
  }

    getCompanyUsers(companyId: number): Observable<ConsultviteUser[]> {
        return this.http.get(this.baseURI + '/companyusers/' + companyId)
            .pipe(map(response => <ConsultviteUser[]>response)
            ,catchError((error: Response) => {
                let errorText = this._errorService.getErrorMessage(error);
                return observableThrowError(errorText);
            }));
    }

    getInternalUserSecurityByUserId(companyId:number,userId:string):Observable<UserSecurity>{
        return this.http.get(this.baseURI + '/internalusersecuritybyuser/' + companyId + '/'+userId,)
           .pipe(map(response => <UserSecurity>response)
           ,catchError((error: Response) => {
               let errorText = this._errorService.getErrorMessage(error);
               return observableThrowError(errorText);
           }));
    }

    getInternalUserRolesByUserId(companyId:number,userId:string):Observable<CompanyModules[]>{
     return this.http.get(this.baseURI + '/internaluserrolesbyuser/' + companyId + '/'+userId,)
        .pipe(map(response => <CompanyModules[]>response)
        ,catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));
    }

    getInternalUserRolesByCompanyId(companyId:number):Observable<CompanyModules[]>{
        return this.http.get(this.baseURI + '/internaluserrolesbycompany/' + companyId)
            .pipe(map(response => <CompanyModules[]>response)
            ,catchError((error: Response) => {
                let errorText = this._errorService.getErrorMessage(error);
                return observableThrowError(errorText);
            }));
    }

    getConsultantUserSecurityByUserId(companyId:number,userId:string):Observable<UserSecurity>{
        return this.http.get(this.baseURI + '/consultantusersecuritybyuser/' + companyId + '/'+userId,)
           .pipe(map(response => <UserSecurity>response)
           ,catchError((error: Response) => {
               let errorText = this._errorService.getErrorMessage(error);
               return observableThrowError(errorText);
           }));
    }

    getConsultantUserRolesByUserId(companyId:number,userId:string):Observable<CompanyModules[]>{
        return this.http.get(this.baseURI + '/consultantuserrolesbyuser/' + companyId + '/'+userId)
            .pipe(map(response => <CompanyModules[]>response)
            ,catchError((error: Response) => {
                let errorText = this._errorService.getErrorMessage(error);
                return observableThrowError(errorText);
            }));
    }

    getConsultantUserRolesByCompanyId(companyId:number):Observable<CompanyModules[]>{
        return this.http.get(this.baseURI + '/consultantuserrolesbycompany/' + companyId)
            .pipe(map(response => <CompanyModules[]>response)
            ,catchError((error: Response) => {
                let errorText = this._errorService.getErrorMessage(error);
                return observableThrowError(errorText);
            }));
    }

    createInternalUser(user: ConsultviteUser): Observable<ConsultviteUser> {
        let headers = new HttpHeaders();
        headers =  headers.append("Content-Type", 'application/json');

        return this.http.post(this.baseURI + '/createinternaluser', user, { headers: headers })
                .pipe(map(response => <ConsultviteUser>response)
            ,catchError((error: Response) => {
                let errorText = this._errorService.getErrorMessage(error);
                return observableThrowError(errorText);
            }));
    }

    createConsultantUser(user: ConsultviteUser): Observable<ConsultviteUser> {
        let headers = new HttpHeaders();
        headers =  headers.append("Content-Type", 'application/json');

        return this.http.post(this.baseURI + '/createconsultantuser', user, { headers: headers })
                .pipe(map(response => <ConsultviteUser>response)
            ,catchError((error: Response) => {
                let errorText = this._errorService.getErrorMessage(error);
                return observableThrowError(errorText);
            }));
    }

    updateInternalUser(user: ConsultviteUser): Observable<ConsultviteUser>  {
        let headers = new HttpHeaders();
        headers =  headers.append("Content-Type", 'application/json');

        return this.http.post(this.baseURI + '/updateinternaluser', user, { headers: headers })
            .pipe(map(response => <ConsultviteUser>response)
            ,catchError((error: Response) => {
                let errorText = this._errorService.getErrorMessage(error);
                return observableThrowError(errorText);
            }));
    }

    updateConsultantUser(user: ConsultviteUser): Observable<ConsultviteUser>  {
        let headers = new HttpHeaders();
        headers =  headers.append("Content-Type", 'application/json');

        return this.http.post(this.baseURI + '/updateconsultantuser', user, { headers: headers })
            .pipe(map(response => <ConsultviteUser>response)
            ,catchError((error: Response) => {
                let errorText = this._errorService.getErrorMessage(error);
                return observableThrowError(errorText);
            }));
    }

    updateInternalUserStatus(userId: string, activeStatus: boolean) {
        let headers = new HttpHeaders();
        headers =  headers.append("Content-Type", 'application/json');
        return this.http.post(this.baseURI + '/updateinternaluserstatus/' + userId + '/' + activeStatus, null,  { headers: headers })
            .pipe(map(response => console.log(response))
            ,catchError((error: Response) => {
                let errorText = this._errorService.getErrorMessage(error);
                return observableThrowError(errorText);
            }));
    }

    updateConsultantUserStatus(userId: string, activeStatus: boolean) {
        let headers = new HttpHeaders();
        headers =  headers.append("Content-Type", 'application/json');
        return this.http.post(this.baseURI + '/updateconsultantuserstatus/' + userId + '/' + activeStatus, null,  { headers: headers })
            .pipe(map(response => console.log(response))
            ,catchError((error: Response) => {
                let errorText = this._errorService.getErrorMessage(error);
                return observableThrowError(errorText);
            }));
    }

    resetUserPassword(resetPassword: ResetPassword) {
        let headers = new HttpHeaders();
        headers =  headers.append("Content-Type", 'application/json');

        return this.http.post(this.baseURI + '/resetuserpassword', resetPassword,  { headers: headers })
            .pipe(map(responce => console.log(responce))
            ,catchError((error: Response) => {
                let errorText = this._errorService.getErrorMessage(error);
                return observableThrowError(errorText);
            }));
    }
}


