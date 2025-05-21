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

export class GlobalSettingsService extends BaseService {

  baseURI = environment.APIServerUrl + 'company';
  settings_api = environment.APIServerUrl + 'Settings';

  constructor(private http: HttpClient,
    private _errorService: ErrorService) {
    super();
  }

  GetGlobalSettings(companyId: number) {
    return this.http.get(this.baseURI + '/GetGlobalSettings/' + companyId)
      .pipe(map(response => <ApiResponse>response)
        , catchError((error: Response) => {
          let errorText = this._errorService.getErrorMessage(error);
          return observableThrowError(errorText);
        }));
  }

  SaveGlobalSettings(globalSettings) {
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type", 'application/json');
    return this.http.post(this.baseURI + '/SaveGlobalSettings', globalSettings, { headers: headers })
      .pipe(map(response => <ApiResponse>response)
        , catchError((error: Response) => {
          let errorText = this._errorService.getErrorMessage(error);
          return observableThrowError(errorText);
        }));
  }

  GetResumeSourceByCompany(CompanyId: number): Observable<ApiResponse> {
    return this.http.get(this.settings_api + '/GetResumeSourceByCompany/' + CompanyId)
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

  GetKeywordsByCompany(companyId: number): Observable<ApiResponse> {
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

  GetHashTag(companyId: string, ModuleName: string, Category: number = 0): Observable<ApiResponse> {
    return this.http.get(this.settings_api + '/GetHashTag/' + companyId + '/' + ModuleName + '/' + Category)
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

  GetCandidateStatusList(companyId: number): Observable<ApiResponse> {
    return this.http.get(this.settings_api + '/GetCandidateStatusList/' + companyId)
      .pipe(map(response => <ApiResponse>response)
        , catchError((error: Response) => {
          let errorText = this._errorService.getErrorMessage(error);
          return observableThrowError(errorText);
        }));
  }

  DeleteCandidateStatus(ApplicantStatus): Observable<ApiResponse> {
    let body = JSON.stringify(ApplicantStatus);
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type", 'application/json');
    return this.http.post(this.settings_api + '/DeleteCandidateStatus', body, { headers: headers })
      .pipe(map(response => <ApiResponse>response)
        , catchError((error: Response) => {
          let errorText = this._errorService.getErrorMessage(error);
          return observableThrowError(errorText);
        }));
  }

  ManageCandidateStatus(ApplicantStatus): Observable<ApiResponse> {
    let body = JSON.stringify(ApplicantStatus);
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type", 'application/json');
    return this.http.post(this.settings_api + '/ManageCandidateStatus', body, { headers: headers })
      .pipe(map(response => <ApiResponse>response)
        , catchError((error: Response) => {
          let errorText = this._errorService.getErrorMessage(error);
          return observableThrowError(errorText);
        }));
  }

  GetInterviewRoundsList(companyId: number): Observable<ApiResponse> {
    return this.http.get(this.settings_api + '/GetInterviewRoundsList/' + companyId)
      .pipe(map(response => <ApiResponse>response)
        , catchError((error: Response) => {
          let errorText = this._errorService.getErrorMessage(error);
          return observableThrowError(errorText);
        }));
  }

  ManageInterviewRoundName(ApplicantStatus): Observable<ApiResponse> {
    let body = JSON.stringify(ApplicantStatus);
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type", 'application/json');
    return this.http.post(this.settings_api + '/ManageInterviewRounds', body, { headers: headers })
      .pipe(map(response => <ApiResponse>response)
        , catchError((error: Response) => {
          let errorText = this._errorService.getErrorMessage(error);
          return observableThrowError(errorText);
        }));
  }

  DeleteInterviewRound(ApplicantStatus): Observable<ApiResponse> {
    let body = JSON.stringify(ApplicantStatus);
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type", 'application/json');
    return this.http.post(this.settings_api + '/DeleteInterviewRound', body, { headers: headers })
      .pipe(map(response => <ApiResponse>response)
        , catchError((error: Response) => {
          let errorText = this._errorService.getErrorMessage(error);
          return observableThrowError(errorText);
        }));
  }

  GetInterviewTypesList(companyId: number): Observable<ApiResponse> {
    return this.http.get(this.settings_api + '/GetInterviewTypesList/' + companyId)
      .pipe(map(response => <ApiResponse>response)
        , catchError((error: Response) => {
          let errorText = this._errorService.getErrorMessage(error);
          return observableThrowError(errorText);
        }));
  }

  ManageInterviewTypeName(ApplicantStatus): Observable<ApiResponse> {
    let body = JSON.stringify(ApplicantStatus);
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type", 'application/json');
    return this.http.post(this.settings_api + '/ManageInterviewType', body, { headers: headers })
      .pipe(map(response => <ApiResponse>response)
        , catchError((error: Response) => {
          let errorText = this._errorService.getErrorMessage(error);
          return observableThrowError(errorText);
        }));
  }

  DeleteInterviewType(ApplicantStatus): Observable<ApiResponse> {
    let body = JSON.stringify(ApplicantStatus);
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type", 'application/json');
    return this.http.post(this.settings_api + '/DeleteInterviewType', body, { headers: headers })
      .pipe(map(response => <ApiResponse>response)
        , catchError((error: Response) => {
          let errorText = this._errorService.getErrorMessage(error);
          return observableThrowError(errorText);
        }));
  }

  GetNotificationsList(companyId: number): Observable<ApiResponse> {
    return this.http.get(this.settings_api + '/GetTCSetting/' + companyId)
      .pipe(map(response => <ApiResponse>response)
        , catchError((error: Response) => {
          let errorText = this._errorService.getErrorMessage(error);
          return observableThrowError(errorText);
        }));
  }

  SaveTCSetting(NotificationItems): Observable<ApiResponse> {
    let body = JSON.stringify(NotificationItems);
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type", 'application/json');
    return this.http.post(this.settings_api + '/SaveTCSetting', body, { headers: headers })
      .pipe(map(response => <ApiResponse>response)
        , catchError((error: Response) => {
          let errorText = this._errorService.getErrorMessage(error);
          return observableThrowError(errorText);
        }));
  }

  GetSessionSettingsList(companyId: number): Observable<ApiResponse> {
    return this.http.get(this.baseURI + '/GetAllSessionSettingAsync/' + companyId)
      .pipe(map(response => <ApiResponse>response)
        , catchError((error: Response) => {
          let errorText = this._errorService.getErrorMessage(error);
          return observableThrowError(errorText);
        }));
  }

  SaveSessionSettings(globalSettings) {
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type", 'application/json');
    return this.http.post(this.baseURI + '/UpdateIdleTimeoutSettingAsync', globalSettings, { headers: headers })
      .pipe(map(response => <ApiResponse>response)
        , catchError((error: Response) => {
          let errorText = this._errorService.getErrorMessage(error);
          return observableThrowError(errorText);
        }));
  }

  GetWorkPermitList(companyId: number): Observable<ApiResponse> {
    return this.http.get(this.settings_api + '/GetWorkPermitsByCompanyId/' + companyId)
      .pipe(map(response => <ApiResponse>response)
        , catchError((error: Response) => {
          let errorText = this._errorService.getErrorMessage(error);
          return observableThrowError(errorText);
        }));
  }

  SaveWorkPermit(workPermitVM:any):Observable<ApiResponse> {
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type", 'application/json');
    return this.http.post(this.settings_api + '/SaveWorkPermit', workPermitVM, { headers: headers })
      .pipe(map(response => <ApiResponse>response)
        , catchError((error: Response) => {
          let errorText = this._errorService.getErrorMessage(error);
          return observableThrowError(errorText);
        }));
  }




}
