import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from "../../environments/environment";
import { LoginUser } from '../models/login-user';
import { BaseService } from '../services/base.service';
import { ChangePassword, ConsultantUserProfile, InternalUserProfile } from '../models';
import { ErrorService } from "../services/error.service";

@Injectable({ providedIn: 'root' })
export class AccountService extends BaseService {
    private baseUrl: string;

    constructor(
        private http: HttpClient,
        private _errorService: ErrorService
    ) {
        super();   
        this.baseUrl = environment.APIServerUrl + 'account';
    }
    
    getLoginUserProfile(): Observable<LoginUser> {
        return this.http.get(this.baseUrl + '/loginuserprofile')
            .pipe(
                map((response: LoginUser) => {
                    let loginUser = <LoginUser>response;
                    return loginUser;
                }),
                catchError(error => this.handleError(error))
            );
    }

    getInternalUserProfile(employerId: string): Observable<InternalUserProfile> {
        return this.http.get(this.baseUrl + '/internaluserprofile/' + employerId)
            .pipe(
                map(response => <InternalUserProfile>response),
                catchError(error => this.handleError(error))
            );
    }

    getConsultantUserProfile(candidateId: string): Observable<ConsultantUserProfile> {
        return this.http.get(this.baseUrl + '/consultantuserprofile/' + candidateId)
            .pipe(
                map(response => <ConsultantUserProfile>response),
                catchError(error => this.handleError(error))
            );
    }

    updateInternalUserProfile(internalUser: InternalUserProfile): Observable<any> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.post(this.baseUrl + '/updateinternaluserprofile', internalUser, { headers })
            .pipe(
                map(response => response),
                catchError(error => this.handleError(error))
            );
    }

    updateConsultantUserProfile(consultantUser: ConsultantUserProfile): Observable<any> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.post(this.baseUrl + '/updateconsultantuserprofile', consultantUser, { headers })
            .pipe(
                map(response => response),
                catchError(error => this.handleError(error))
            );
    }

    changeInternalUserPassword(changePassword: ChangePassword): Observable<any> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.post(this.baseUrl + '/changeinternaluserpassword', changePassword, { headers })
            .pipe(
                map(response => response),
                catchError(error => this.handleError(error))
            );
    }

    changeConsultantUserPassword(changePassword: ChangePassword): Observable<any> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.post(this.baseUrl + '/changeconsultantuserpassword', changePassword, { headers })
            .pipe(
                map(response => response),
                catchError(error => this.handleError(error))
            );
    }
}



