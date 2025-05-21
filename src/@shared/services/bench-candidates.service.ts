import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { throwError } from 'rxjs';
import { map, retry, catchError } from 'rxjs/operators';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { environment } from  '../../environments/environment'; 
import { BenchCandidate } from   '../models/common/benchcandidate';
import { SubmissionsVM } from 'src/@shared/core/ats/models/submissionsvm';
import { Submissions } from 'src/@shared/core/ats/models/submission';
import { BaseService, ErrorService } from 'src/@shared/services';
import { FileUploadResponse } from 'src/@shared/models/fileuploadresponse';
import { ResumeSource } from 'src/@shared/core/ats/models/resumesource';
import { SubUsers } from 'src/@shared/models/common/subusers';
import { ApiResponse } from '../models/apiresponse';



@Injectable({
  providedIn: 'root'
})
export class BenchCandidateService extends BaseService {

  talentCentral_api = environment.APIServerUrl + 'TalentCentral';
  common_api = environment.APIServerUrl + 'Common';
  Filestore_api = environment.APIServerUrl + 'FileStore';
  marketingdashboard_api = environment.APIServerUrl+'MarketingDashboard';
  candidates_api = environment.APIServerUrl + 'Candidates';

  constructor(private http: HttpClient,
              private _errorService: ErrorService) {
      super();  
  }

  GetAllBenchCandidates(benchCandidateSearch: any): Observable<ApiResponse> {
    let headers = new HttpHeaders();
        headers =  headers.append("Content-Type", 'application/json');

        return this.http.post(this.marketingdashboard_api + '/GetAllBenchCandidates', benchCandidateSearch, { headers: headers })
             .pipe(map(response => <ApiResponse>response)
            ,catchError((error: Response) => {
                let errorText = this._errorService.getErrorMessage(error);
                return observableThrowError(errorText);
            }));
  }

  GetSubmissionsByCandidate(CandidateId: number, CompanyId: number, userId: string) {
    return this.http.get(this.marketingdashboard_api + '/GetSubmissionsByCandidate/' + CandidateId + '/' + CompanyId + '/' + userId)
        .pipe(map(response => <SubmissionsVM[]>response)
        ,catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));
  }

  GetSubmissonsBySubmissionId(CompanyId: number, SubmissionId: number) {
    return this.http.get(this.marketingdashboard_api + '/GetSubmissionBySubmissionID/' + CompanyId + '/' + SubmissionId)
        .pipe(map(response => <Submissions>response)
        ,catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));

  }

  GetSubmissionStatusList(companyId: number): Observable<any[]> {
    return this.http.get(this.talentCentral_api + '/GetMasterSubmissionStatusList/' + companyId)
        .pipe(map(response => <any[]>response)
        ,catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));
  }
  GetAccounts(companyID: number): Observable<any[]> {
    return this.http.get(this.talentCentral_api + '/GetAllAccounts/' + companyID)
        .pipe(map(response => <any[]>response)
        ,catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));
  }

  QuickSubmit(submission: Submissions) {
    let headers = new HttpHeaders();
    headers =  headers.append("Content-Type", 'application/json');

    return this.http.post(this.talentCentral_api + '/QuickSubmit', submission, { headers: headers })
         .pipe(map(response => <BenchCandidate[]>response)
        ,catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));
  }

  EditSubmission(submission: Submissions) {
    let headers = new HttpHeaders();
    headers =  headers.append("Content-Type", 'application/json');
    let body = JSON.stringify(submission);
    return this.http.post(this.talentCentral_api + '/EditSubmission', submission, { headers: headers })
         .pipe(map(response => <BenchCandidate[]>response)
        ,catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));
  }

  GetKeywords() {
    return this.http.get(this.common_api + '/Keywords/' )
    .pipe(map(response => <any[]>response)
    ,catchError((error: Response) => {
        let errorText = this._errorService.getErrorMessage(error);
        return observableThrowError(errorText);
    }));
  }

  async GetHashTagKeywords() {
    return await this.http.get(this.common_api + '/Keywords/' )
    .toPromise().then(response => <ApiResponse>response)
    ,catchError((error: Response) => {
        let errorText = this._errorService.getErrorMessage(error);
        return observableThrowError(errorText);
    });
  }

//   async SyncCheckCandidateByEmail(CandidateSearch){
//     let headers = new HttpHeaders();
//     headers = headers.append("Content-Type", 'application/json');
//     let body = JSON.stringify(CandidateSearch);
//     return await this.http.post(this.candidate_api + '/VerifyCandidateByEmail', body, { headers: headers })
//     .toPromise().then(response => <ApiResponse>response);
// }

  getCRMHashTag(companyId: number, ModuleName: string, Category: number = 0): Observable<any[]> {
    return this.http.get(this.common_api + '/GetHashTag/' + companyId + '/' + ModuleName + '/' + Category )
    .pipe(map(response => <any[]>response)
    ,catchError((error: Response) => {
        let errorText = this._errorService.getErrorMessage(error);
        return observableThrowError(errorText);
    }));
  }

  uploadResumeAndParsing(file: File[]): Observable<FileUploadResponse> {
    let formData: FormData = new FormData();
    formData.append("file", file[0]);

    return this.http.post(this.Filestore_api + '/UploadResumeAndParsing', formData)
      .pipe(map(response => <FileUploadResponse>response)
        , catchError((error: Response) => {
          let errorText = this._errorService.getErrorMessage(error);
          return observableThrowError(errorText);
        }));
  }

  getResumeSourceByCompany(companyId: number): Observable<ResumeSource[]> {
    return this.http.get(this.talentCentral_api + '/GetResumeSourceByCompany/' + companyId )
    .pipe(map(response => <ResumeSource[]>response)
    ,catchError((error: Response) => {
        let errorText = this._errorService.getErrorMessage(error);
        return observableThrowError(errorText);
    }));
  }


   getBenchCandidateForEdit(benchCandidateId: number): Observable<BenchCandidate> {
    return this.http.get(this.talentCentral_api + '/GetBenchCandidateForEdit/' + benchCandidateId )
    .pipe(map(response => <BenchCandidate>response)
    ,catchError((error: Response) => {
        let errorText = this._errorService.getErrorMessage(error);
        return observableThrowError(errorText);
    }));

  }

   getBenchSubUsers(companyId: number): Observable<SubUsers[]> {
    return this.http.get(this.marketingdashboard_api + '/GetBenchSubUsers/' + companyId )
    .pipe(map(response => <SubUsers[]>response)
    ,catchError((error: Response) => {
        let errorText = this._errorService.getErrorMessage(error);
        return observableThrowError(errorText);
    }));

  }
  UpdateCandidatePriority(benchCandidates: any) {
    let headers = new HttpHeaders();
    headers =  headers.append("Content-Type", 'application/json');
    let body = JSON.stringify(benchCandidates);
    return this.http.post(this.marketingdashboard_api + '/UpdateCandidatePriority', body, { headers: headers })
         .pipe(map(response => <any>response)
        ,catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));
  }

   getBenchCandidateById(CompanyId: number,CandidateId:number): Observable<any> {
    return this.http.get(this.candidates_api + '/GetCandidateById/' + CompanyId +'/'+ CandidateId)
    .pipe(map(response => <any>response)
    ,catchError((error: Response) => {
        let errorText = this._errorService.getErrorMessage(error);
        return observableThrowError(errorText);
    }));

  }


}