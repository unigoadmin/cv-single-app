import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { BaseService } from 'src/@shared/services/base.service';
import { environment } from 'src/environments/environment';
import { throwError as observableThrowError,Observable } from 'rxjs';
import { ErrorService } from 'src/@shared/services';
import { ApiResponse } from '../models/apiresponse';


@Injectable({
  providedIn: 'root'
})
export class ConfirmationService extends BaseService {
  talentCentral_api = environment.APIServerUrl + 'TalentCentral';
  confirmation_api = environment.APIServerUrl + 'Confirmation';
  placement_api = environment.APIServerUrl + 'Placement';
  candidate_api = environment.APIServerUrl + "Candidates";
  constructor(private http: HttpClient,
    private _errorService: ErrorService){
      super(); 
  }
  GetAccounts(companyID: number): Observable<any[]> {
    return this.http.get(this.talentCentral_api + '/GetAllAccounts/' + companyID)
        .pipe(map(response => <any[]>response)
        ,catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));
  }
  SaveConfirmation(confirmation):Observable<ApiResponse>{
    let body=JSON.stringify(confirmation);
    let headers = new HttpHeaders();
    headers =  headers.append("Content-Type", 'application/json');
    return this.http.post(this.confirmation_api + '/SaveNewConfirmation',body,{headers:headers})
        .pipe(map(response => <ApiResponse>response)
        ,catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));
  }
  EditConfirmation(confirmation){
    let body=JSON.stringify(confirmation);
    let headers = new HttpHeaders();
    headers =  headers.append("Content-Type", 'application/json');
    return this.http.post(this.confirmation_api + '/UpdateConfirmation',body,{headers:headers})
        .pipe(map(response => <ApiResponse>response)
        ,catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));
  }
  GetConfirmations(confirmationFilter:any): Observable<ApiResponse>{
    let body=JSON.stringify(confirmationFilter);
    let headers = new HttpHeaders();
    headers =  headers.append("Content-Type", 'application/json');
    return this.http.post(this.confirmation_api + '/GetCofirmations',body,{headers:headers})
        .pipe(map(response => <ApiResponse>response)
        ,catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));
  }
  GetConfirmation(CompanyId:any,confirmationid:any): Observable<ApiResponse>{
    return this.http.get(this.confirmation_api + '/GetConfirmationById/'+CompanyId+'/'+confirmationid)
        .pipe(map(response => <ApiResponse>response)
        ,catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));
  }

  async SyncCheckCandidateByEmail(CandidateSearch){
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type", 'application/json');
    let body = JSON.stringify(CandidateSearch);
    return await this.http.post(this.candidate_api + '/VerifyCandidateByEmail', body, { headers: headers })
    .toPromise().then(response => <ApiResponse>response);
}
ConvertConfirmationToPlacement(confirmation){
  let body=JSON.stringify(confirmation);
    let headers = new HttpHeaders();
    headers =  headers.append("Content-Type", 'application/json');
    return this.http.post(this.placement_api + '/ConvertConfirmationToPlacement',body,{headers:headers})
        .pipe(map(response => <ApiResponse>response)
        ,catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));
}
GetConfirmaionStatusList(companyId: number): Observable<ApiResponse> {
  return this.http.get(this.confirmation_api + '/GetConfirmationStatusList/' + companyId)
      .pipe(map(response => <ApiResponse>response)
      ,catchError((error: Response) => {
          let errorText = this._errorService.getErrorMessage(error);
          return observableThrowError(errorText);
      }));
}

UpdateConfirmationStatus(submission: any) {
  let headers = new HttpHeaders();
  headers =  headers.append("Content-Type", 'application/json');
  let body = JSON.stringify(submission);
  return this.http.post(this.confirmation_api + '/UpdateSubmisionStatus', body, { headers: headers })
       .pipe(map(response => <ApiResponse>response)
      ,catchError((error: Response) => {
          let errorText = this._errorService.getErrorMessage(error);
          return observableThrowError(errorText);
      }));
}

GetConfirmationActivityLog(ConfirmationId:number,companyId:number){
  let headers = new HttpHeaders();
  headers = headers.append("Content-Type", 'application/json');
  return this.http.get(this.confirmation_api + '/GetConfirmationActivity/' + ConfirmationId+"/"+companyId, { headers: headers })
      .pipe(map(response => <ApiResponse>response)
          , catchError((error: Response) => {
              let errorText = this._errorService.getErrorMessage(error);
              return observableThrowError(errorText);
          }));
  
}

}