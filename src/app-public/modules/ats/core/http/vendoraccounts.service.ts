import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { BaseService } from 'src/@shared/services/base.service';
import { environment } from 'src/environments/environment';
import { throwError as observableThrowError,Observable } from 'rxjs';
import { ErrorService } from 'src/@shared/services';
import { ApiResponse } from '../models/apiresponse';
import { SubUsers } from 'src/@shared/models/common/subusers';

@Injectable({
    providedIn: 'root'
  })

  export class VendorAccountService extends BaseService{
    accounts_api = environment.APIServerUrl + 'VendorAccounts';
    marketingdashboard_api = environment.APIServerUrl + 'MarketingDashboard';
    constructor(private http: HttpClient,
      private _errorService: ErrorService){
        super(); 
    }

    GetAllAccounts(acountFilters: any): Observable<ApiResponse> {
        let headers = new HttpHeaders();
            headers =  headers.append("Content-Type", 'application/json');
            return this.http.post(this.accounts_api + '/GetAccountsList', acountFilters, { headers: headers })
                 .pipe(map(response => <ApiResponse>response)
                ,catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
      }

      GetAccountTypes() {
        return this.http.get(this.accounts_api + '/GetAccountTypes')
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    GetAccountContacts(companyId:number,AccountId:number){
        return this.http.get(this.accounts_api + '/GetAccountContacts/'+AccountId+'/'+companyId)
        .pipe(map(response => <ApiResponse>response)
            , catchError((error: Response) => {
                let errorText = this._errorService.getErrorMessage(error);
                return observableThrowError(errorText);
            }));
    }

    SaveAccount(acountitem: any): Observable<ApiResponse> {
        let headers = new HttpHeaders();
            headers =  headers.append("Content-Type", 'application/json');
            return this.http.post(this.accounts_api + '/SaveNewAccount', acountitem, { headers: headers })
                 .pipe(map(response => <ApiResponse>response)
                ,catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
      }

      MergeAccounts(MergeAccounts:any):Observable<ApiResponse>{
        let headers = new HttpHeaders();
        headers =  headers.append("Content-Type", 'application/json');
        return this.http.post(this.accounts_api + '/MergeAccounts', MergeAccounts, { headers: headers })
             .pipe(map(response => <ApiResponse>response)
            ,catchError((error: Response) => {
                let errorText = this._errorService.getErrorMessage(error);
                return observableThrowError(errorText);
            }));
      }

      
    GetAssociatedAccounts(companyId:number,AccountId:number){
        return this.http.get(this.accounts_api + '/GetAssociatedAccounts/'+companyId+'/'+AccountId)
        .pipe(map(response => <ApiResponse>response)
            , catchError((error: Response) => {
                let errorText = this._errorService.getErrorMessage(error);
                return observableThrowError(errorText);
            }));
    }

    getBenchSubUsers(companyId: number): Observable<SubUsers[]> {
        return this.http.get(this.accounts_api + '/GetInternalUsers/' + companyId)
            .pipe(map(response => <SubUsers[]>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));

    }

    GetAccountDetails(companyId:number,AccountId:number){
        return this.http.get(this.accounts_api + '/GetAccountDetails/'+companyId+'/'+AccountId)
        .pipe(map(response => <ApiResponse>response)
            , catchError((error: Response) => {
                let errorText = this._errorService.getErrorMessage(error);
                return observableThrowError(errorText);
            }));
    }

    UpdateContact(contactitem: any): Observable<ApiResponse> {
        let headers = new HttpHeaders();
            headers =  headers.append("Content-Type", 'application/json');
            return this.http.post(this.accounts_api + '/UpdateContact', contactitem, { headers: headers })
                 .pipe(map(response => <ApiResponse>response)
                ,catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
      }

      GetAccountMasterNotes(companyId:number,AccountId:number){
        return this.http.get(this.accounts_api + '/GetAccountMasterNotes/'+companyId+'/'+AccountId)
        .pipe(map(response => <ApiResponse>response)
            , catchError((error: Response) => {
                let errorText = this._errorService.getErrorMessage(error);
                return observableThrowError(errorText);
            }));
    }

    SaveAccountMasterNotes(accountNotes:any):Observable<ApiResponse>{
        let headers = new HttpHeaders();
        headers =  headers.append("Content-Type", 'application/json');
        return this.http.post(this.accounts_api + '/AddCandidateMasterNotes', accountNotes, { headers: headers })
             .pipe(map(response => <ApiResponse>response)
            ,catchError((error: Response) => {
                let errorText = this._errorService.getErrorMessage(error);
                return observableThrowError(errorText);
            }));
      }




}