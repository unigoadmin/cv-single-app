import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { BaseService } from 'src/@shared/services/base.service';
import { environment } from 'src/environments/environment';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { ErrorService } from 'src/@shared/services';
import { ApiResponse } from '../models/apiresponse';

@Injectable({
  providedIn: 'root'
})

export class TCSettingsService extends BaseService {
  settings_api = environment.APIServerUrl + 'Settings';
  constructor(private http: HttpClient,
    private _errorService: ErrorService) {
    super();
  }

  GetInterviewStatus(CompanyId: number): Observable<ApiResponse> {
    return this.http.get(this.settings_api + '/GetInterviewStatus/' + CompanyId)
      .pipe(map(response => <ApiResponse>response)
        , catchError((error: Response) => {
          let errorText = this._errorService.getErrorMessage(error);
          return observableThrowError(errorText);
        }));
  }
 
  AddResumeSource(resumeSource, userId: string): Observable<ApiResponse> {
    let body = JSON.stringify(resumeSource);
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type", 'application/json');
    return this.http.post(this.settings_api + '/AddResumeSource/' + userId, body, { headers: headers })
      .pipe(map(response => <ApiResponse>response)
        , catchError((error: Response) => {
          let errorText = this._errorService.getErrorMessage(error);
          return observableThrowError(errorText);
        }));
  }
  GetHashTag(companyId: string,ModuleName:string,Category:number=0): Observable<ApiResponse> {
    return this.http.get(this.settings_api + '/GetHashTag/' + companyId+'/'+ModuleName+'/'+Category)
      .pipe(map(response => <ApiResponse>response)
        , catchError((error: Response) => {
          let errorText = this._errorService.getErrorMessage(error);
          return observableThrowError(errorText);
        }));
  }
  addHashTag(hashtag): Observable<ApiResponse> {
    let body = JSON.stringify(hashtag);
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type", 'application/json');
    return this.http.post(this.settings_api + '/SaveHashTag', body, { headers: headers })
      .pipe(map(response => <ApiResponse>response)
        , catchError((error: Response) => {
          let errorText = this._errorService.getErrorMessage(error);
          return observableThrowError(errorText);
        }));
  }
  deleteHashTag(hashtag): Observable<ApiResponse> {
    let body = JSON.stringify(hashtag);
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type", 'application/json');
    return this.http.post(this.settings_api + '/DeleteHashTag', body, { headers: headers })
      .pipe(map(response => <ApiResponse>response)
        , catchError((error: Response) => {
          let errorText = this._errorService.getErrorMessage(error);
          return observableThrowError(errorText);
        }));
  }
  GetBenchAccountTypes(companyId:number): Observable<ApiResponse> {
    return this.http.get(this.settings_api + '/GetBenchAccountTypes/' + companyId)
      .pipe(map(response => <ApiResponse>response)
        , catchError((error: Response) => {
          let errorText = this._errorService.getErrorMessage(error);
          return observableThrowError(errorText);
        }));
  }
  GetMasterSubmissionStatusList(companyId:number): Observable<ApiResponse> {
    return this.http.get(this.settings_api + '/GetMasterSubmissionStatusList/' + companyId)
      .pipe(map(response => <ApiResponse>response)
        , catchError((error: Response) => {
          let errorText = this._errorService.getErrorMessage(error);
          return observableThrowError(errorText);
        }));
  }
  AddInterviewStatus(interviewStatus): Observable<ApiResponse> {
    let body = JSON.stringify(interviewStatus);
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type", 'application/json');
    return this.http.post(this.settings_api + '/AddInterviewStatus', body, { headers: headers })
      .pipe(map(response => <ApiResponse>response)
        , catchError((error: Response) => {
          let errorText = this._errorService.getErrorMessage(error);
          return observableThrowError(errorText);
        }));
  }
  AddMasterSubmissionStatus(SubmissionStatus): Observable<ApiResponse> {
    let body = JSON.stringify(SubmissionStatus);
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type", 'application/json');
    return this.http.post(this.settings_api + '/AddMasterSubmissionStatus', body, { headers: headers })
      .pipe(map(response => <ApiResponse>response)
        , catchError((error: Response) => {
          let errorText = this._errorService.getErrorMessage(error);
          return observableThrowError(errorText);
        }));
  }
  AddBenchAccountTypes(AccountTypes): Observable<ApiResponse> {
    let body = JSON.stringify(AccountTypes);
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type", 'application/json');
    return this.http.post(this.settings_api + '/AddBenchAccountTypes', body, { headers: headers })
      .pipe(map(response => <ApiResponse>response)
        , catchError((error: Response) => {
          let errorText = this._errorService.getErrorMessage(error);
          return observableThrowError(errorText);
        }));
  }
  GetKeywordsByCompany(companyId:number): Observable<ApiResponse> {
    return this.http.get(this.settings_api + '/GetKeywordsByCompany/' + companyId)
      .pipe(map(response => <ApiResponse>response)
        , catchError((error: Response) => {
          let errorText = this._errorService.getErrorMessage(error);
          return observableThrowError(errorText);
        }));
  }
  SaveKeywords(Keywords): Observable<ApiResponse> {
    let body = JSON.stringify(Keywords);
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type", 'application/json');
    return this.http.post(this.settings_api + '/SaveKeywords', body, { headers: headers })
      .pipe(map(response => <ApiResponse>response)
        , catchError((error: Response) => {
          let errorText = this._errorService.getErrorMessage(error);
          return observableThrowError(errorText);
        }));
  }
  DeleteSubmissionStatus(SubmissionStatus): Observable<ApiResponse> {
    let body = JSON.stringify(SubmissionStatus);
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type", 'application/json');
    return this.http.post(this.settings_api + '/DeleteSubmissionStatus', body, { headers: headers })
      .pipe(map(response => <ApiResponse>response)
        , catchError((error: Response) => {
          let errorText = this._errorService.getErrorMessage(error);
          return observableThrowError(errorText);
        }));
  }

  DeleteInterviewStatus(InterviewStatus): Observable<ApiResponse> {
    let body = JSON.stringify(InterviewStatus);
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type", 'application/json');
    return this.http.post(this.settings_api + '/DeleteInterviewStatus', body, { headers: headers })
      .pipe(map(response => <ApiResponse>response)
        , catchError((error: Response) => {
          let errorText = this._errorService.getErrorMessage(error);
          return observableThrowError(errorText);
        }));
  }
}