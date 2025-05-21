import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { BaseService } from 'src/@shared/services/base.service';
import { environment } from 'src/environments/environment';
import { throwError as observableThrowError,Observable } from 'rxjs';
import { ErrorService } from 'src/@shared/services';
import { ApiResponse } from '../models/apiresponse';
import { Submissions } from 'src/@shared/core/ats/models/submission';
import { SubmissionsList } from '../models/submissionlist';


@Injectable({
  providedIn: 'root'
})
export class SubmissionService extends BaseService {
public submissionURI:string=environment.APIServerUrl+"Submissions";

constructor(private http:HttpClient,private _errorService: ErrorService){
    super();
}

GetAllSubmissions(submissionFilter:any):Observable<ApiResponse> {
    let headers = new HttpHeaders();
    headers =  headers.append("Content-Type", 'application/json');
    let body = JSON.stringify(submissionFilter);
    return this.http.post(this.submissionURI + '/GetAllSubmissions', body, { headers: headers })
    .pipe(map(response => <ApiResponse>response)
    ,catchError((error: Response) => {
        let errorText = this._errorService.getErrorMessage(error);
        return observableThrowError(errorText);
    }));
  }
  
  UpdateSubmissionStatus(submission: any) {
    let headers = new HttpHeaders();
    headers =  headers.append("Content-Type", 'application/json');
    let body = JSON.stringify(submission);
    return this.http.post(this.submissionURI + '/UpdateSubmisionStatus', body, { headers: headers })
         .pipe(map(response => <ApiResponse>response)
        ,catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));
  }

  GetSubmissionsByCandidate(CandidateId: number, CompanyId: number, userId: string) {
    return this.http.get(this.submissionURI + '/GetSubmissionsByCandidate/' + CandidateId + '/' + CompanyId + '/' + userId)
        .pipe(map(response => <ApiResponse>response)
        ,catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));
  }

  GetSubmissionStatusList(companyId: number): Observable<ApiResponse> {
    return this.http.get(this.submissionURI + '/GetMasterSubmissionStatusList/' + companyId)
        .pipe(map(response => <ApiResponse>response)
        ,catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));
  }

  QuickSubmit(submission: Submissions) {
    let headers = new HttpHeaders();
    headers =  headers.append("Content-Type", 'application/json');
    let body = JSON.stringify(submission);
    return this.http.post(this.submissionURI + '/QuickSubmit', body, { headers: headers })
         .pipe(map(response => <ApiResponse>response)
        ,catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));
  }

  EditSubmission(submission: Submissions) {
    let headers = new HttpHeaders();
    headers =  headers.append("Content-Type", 'application/json');
    let body = JSON.stringify(submission);
    return this.http.post(this.submissionURI + '/EditSubmission', body, { headers: headers })
         .pipe(map(response => <ApiResponse>response)
        ,catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));
  }

  GetAccounts(companyID: number): Observable<ApiResponse> {
    return this.http.get(this.submissionURI + '/GetAllAccounts/' + companyID)
        .pipe(map(response => <ApiResponse>response)
        ,catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));
  }

  GetSubmissonsBySubmissionId(CompanyId: number, SubmissionId: number) {
    return this.http.get(this.submissionURI + '/GetSubmissionBySubmissionID/' + CompanyId + '/' + SubmissionId)
        .pipe(map(response => <ApiResponse>response)
        ,catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));

  }

  GetSubmissonActivityLog(CompanyId: number, SubmissionId: number) {
    return this.http.get(this.submissionURI + '/GetSubmissionActivity/' + SubmissionId+"/"+CompanyId)
        .pipe(map(response => <ApiResponse>response)
            , catchError((error: Response) => {
                let errorText = this._errorService.getErrorMessage(error);
                return observableThrowError(errorText);
            }));

  }

  MigrateToConfirmation(submission: any) {
    let headers = new HttpHeaders();
    headers =  headers.append("Content-Type", 'application/json');
    let body = JSON.stringify(submission);
    return this.http.post(this.submissionURI + '/MigrateToConfirmation', body, { headers: headers })
         .pipe(map(response => <ApiResponse>response)
        ,catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));
  }

  UpdateSubmissionToConfirmation(submission: any) {
    let headers = new HttpHeaders();
    headers =  headers.append("Content-Type", 'application/json');
    let body = JSON.stringify(submission);
    return this.http.post(this.submissionURI + '/UpdateSubmisionToConfirmation', body, { headers: headers })
         .pipe(map(response => <ApiResponse>response)
        ,catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));
  }

  CheckSubmissionStatus(CompanyId: number, SubmissionId: number) {
    return this.http.get(this.submissionURI + '/CheckSubmissionStatus/' + CompanyId + '/' + SubmissionId)
        .pipe(map(response => <ApiResponse>response)
        ,catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));

  }

  GetSbmissionActivityLog(SubmissionId:number,companyId:number){
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type", 'application/json');
    return this.http.get(this.submissionURI + '/GetSubmissionActivity/' + SubmissionId+"/"+companyId, { headers: headers })
        .pipe(map(response => <ApiResponse>response)
            , catchError((error: Response) => {
                let errorText = this._errorService.getErrorMessage(error);
                return observableThrowError(errorText);
            }));
    
  }




}