import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { BaseService } from 'src/@shared/services/base.service';
import { environment } from 'src/environments/environment';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { ErrorService } from 'src/@shared/services';
import { ApiResponse } from '../model/apiresponse';
import { SubUsers } from 'src/@shared/models/common/subusers';
import { ResumeSource } from 'src/@shared/core/ats/models/resumesource';
import { BenchCandidate } from '../model/benchcandidate';

@Injectable({
    providedIn: 'root'
})
export class JobCandidateService extends BaseService {
    talentCentral_api = environment.APIServerUrl + 'TalentCentral';
    common_api = environment.APIServerUrl + 'Common';
    candidate_api = environment.APIServerUrl + "Candidates";
    Filestore_api = environment.APIServerUrl + 'FileStore';
    marketingdashboard_api = environment.APIServerUrl + 'MarketingDashboard';
    constructor(private http: HttpClient,
        private _errorService: ErrorService) { super(); }

    getCandidates(jobsSearch: any): Observable<ApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.post(this.candidate_api + '/GetJobCentralCandidates', jobsSearch, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    DeleteCandidate(candidateVM:any):Observable<ApiResponse>{
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.post(this.candidate_api + '/DeleteCandidate', candidateVM, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    public getBenchSubUsers(companyId: number): Observable<SubUsers[]> {
        return this.http.get(this.marketingdashboard_api + '/GetBenchSubUsers/' + companyId)
            .pipe(map(response => <SubUsers[]>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    GetKeywords(companyId:number):Observable<any[]> {
        return this.http.get(this.common_api + '/Keywords/'+companyId )
        .pipe(map(response => <any[]>response)
        ,catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));
      }

      getCRMHashTag(companyId: number, ModuleName: string, Category: number = 0): Observable<any[]> {
        return this.http.get(this.common_api + '/GetHashTag/' + companyId + '/' + ModuleName + '/' + Category )
        .pipe(map(response => <any[]>response)
        ,catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));
      }

      getResumeSourceByCompany(companyId: number): Observable<ResumeSource[]> {
        return this.http.get(this.marketingdashboard_api + '/GetResumeSourceByCompany/' + companyId )
        .pipe(map(response => <ResumeSource[]>response)
        ,catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));
      }

      uploadResumeAndParsing(file: File[]): Observable<ApiResponse> {
        let formData: FormData = new FormData();
        formData.append("file", file[0]);

        return this.http.post(this.Filestore_api + '/UploadResumeAndParsing', formData)
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    //   saveBenchCandidates(benchCandidates: BenchCandidate): Observable<ApiResponse> {
    //     let headers = new HttpHeaders();
    //     headers = headers.append("Content-Type", 'application/json');

    //     return this.http.post(this.marketingdashboard_api + '/SaveBenchCandidate', benchCandidates, { headers: headers })
    //         .pipe(map(response => <ApiResponse>response)
    //             , catchError((error: Response) => {
    //                 let errorText = this._errorService.getErrorMessage(error);
    //                 return observableThrowError(errorText);
    //             }));
    // }

    SaveCandidate(benchCandidates: BenchCandidate): Observable<ApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');

        return this.http.post(this.candidate_api + '/SaveCandidate', benchCandidates, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
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

    GetCandidateForEdit(benchCandidateId: number,companyId: number): Observable<ApiResponse> {
        return this.http.get(this.candidate_api + '/GetJCCandidateById/' +companyId + '/'+ benchCandidateId )
        .pipe(map(response => <ApiResponse>response)
        ,catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));
    
      }
}
