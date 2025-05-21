import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { BaseService } from 'src/@shared/services/base.service';
import { environment } from 'src/environments/environment';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { ErrorService } from 'src/@shared/services';
import { ApiResponse } from '../models/apiresponse';
import { ResumeSource } from 'src/@shared/core/ats/models/resumesource';
import { FileUploadResponse } from 'src/@shared/models';
import { SubUsers } from 'src/@shared/models/common/subusers';

@Injectable({
    providedIn: 'root'
})
export class MarketingDashboardService extends BaseService {

    //talentCentral_api = environment.APIServerUrl + 'TalentCentral';
    common_api = environment.APIServerUrl + 'Common';
    Filestore_api = environment.APIServerUrl + 'FileStore';
    marketingdashboard_api = environment.APIServerUrl + 'MarketingDashboard';
    candidate_api = environment.APIServerUrl + "Candidates";

    constructor(private http: HttpClient,
        private _errorService: ErrorService) {
        super();
    }

    // saveBenchCandidates(benchCandidates: BenchCandidate): Observable<ApiResponse> {
    //     let headers = new HttpHeaders();
    //     headers = headers.append("Content-Type", 'application/json');

    //     return this.http.post(this.candidate_api + '/SaveBenchCandidateNew', benchCandidates, { headers: headers })
    //         .pipe(map(response => <ApiResponse>response)
    //             , catchError((error: Response) => {
    //                 let errorText = this._errorService.getErrorMessage(error);
    //                 return observableThrowError(errorText);
    //             }));
    // }
    getKeywords(companyId: number):Observable<any[]> {
        return this.http.get(this.common_api + '/Keywords/'+companyId)
            .pipe(map(response => <any[]>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }
    getCRMHashTag(companyId: number, ModuleName: string, Category: number = 0): Observable<any[]> {
        return this.http.get(this.common_api + '/GetHashTag/' + companyId + '/' + ModuleName + '/' + Category)
            .pipe(map(response => <any[]>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }
    getResumeSourceByCompany(companyId: number): Observable<ResumeSource[]> {
        return this.http.get(this.marketingdashboard_api + '/GetResumeSourceByCompany/' + companyId)
            .pipe(map(response => <ResumeSource[]>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }
    uploadResume(file: File[]): Observable<FileUploadResponse> {
        let formData: FormData = new FormData();
        formData.append("file", file[0]);

        return this.http.post(this.Filestore_api + '/UploadResumeAndParsing', formData)
            .pipe(map(response => <FileUploadResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }
    uploadResumeAndParsing(file: File[]): Observable<any> {
        let formData: FormData = new FormData();
        formData.append("file", file[0]);

        return this.http.post(this.Filestore_api + '/UploadResumeAndParsing', formData)
            .pipe(map(response => <any>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }
    getBenchSubUsers(companyId: number): Observable<SubUsers[]> {
        return this.http.get(this.marketingdashboard_api + '/GetBenchSubUsers/' + companyId)
            .pipe(map(response => <SubUsers[]>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));

    }
     GetBenchCandidateForEdit(benchCandidateId: number,companyId: number): Observable<ApiResponse> {
        return this.http.get(this.candidate_api + '/GetCandidateById/' +companyId + '/'+ benchCandidateId )
        .pipe(map(response => <ApiResponse>response)
        ,catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));
    
      }

    //   downloadResume(fileName: string, fileType: string): Observable<Blob> {
    //     let headers = new HttpHeaders();
    //     headers.append('Content-Type', 'application/json');
    //     headers.append('responseType', 'arrayBuffer');
        
    //     return this.http.get(this.marketingdashboard_api + '/DownloadResume/' + fileName + '/' + fileType, { responseType: 'blob' })
    //         .pipe(map((response:Blob) => response)
    //         ,catchError((error: Response) => {
    //             let errorText = this._errorService.getErrorMessage(error);
    //             return observableThrowError(errorText);
    //         }));
    // }

    public RemoveCandidateResume(benchCandidateId:number):Observable<any>{
        return this.http.get(this.marketingdashboard_api+ '/RemoveBenchCandidateResume/'+benchCandidateId)
                        .pipe(map(response =><ApiResponse> response)
                        ,catchError((error: Response) => {
                            let errorText = this._errorService.getErrorMessage(error);
                            return observableThrowError(errorText);
                        }));
       }

    //    async SyncCheckCandidateByEmail(CandidateSearch){
    //     let headers = new HttpHeaders();
    //     headers = headers.append("Content-Type", 'application/json');
    //     let body = JSON.stringify(CandidateSearch);
    //     return await this.http.post(this.candidate_api + '/VerifyCandidateByEmail', body, { headers: headers })
    //     .toPromise().then(response => <ApiResponse>response);
    // }

    uploadOnlyResume(file: File[]): Observable<any> {
        let formData: FormData = new FormData();
        formData.append("file", file[0]);

        return this.http.post(this.Filestore_api + '/UploadResume', formData)
            .pipe(map(response => <any>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    // downloadAttachment(filedetails:any): Observable<Blob> {
    //     let headers = new HttpHeaders();
    //     headers.append('Content-Type', 'application/json');
    //     headers.append('responseType', 'arrayBuffer');
        
    //     return this.http.post(this.candidate_api + '/DownloadCandidateResume',filedetails, { responseType: 'blob' })
    //         .pipe(map((response:Blob) => response)
    //         ,catchError((error: Response) => {
    //             let errorText = this._errorService.getErrorMessage(error);
    //             return observableThrowError(errorText);
    //         }));
    // }

    // uploadCandidateReseume(file: File[],candidate:any): Observable<ApiResponse> {
    //     let formData: FormData = new FormData();
    //     formData.append("file", file[0]);
    //     formData.append("CompanyId",candidate.CompanyId);
    //     formData.append("CandidateId",candidate.CandidateId);
    //     formData.append("UpdatedBy",candidate.UpdatedBy);
    //     return this.http.post(this.Filestore_api + '/UpdateCandidateResume', formData)
    //         .pipe(map(response => <any>response)
    //             , catchError((error: Response) => {
    //                 let errorText = this._errorService.getErrorMessage(error);
    //                 return observableThrowError(errorText);
    //             }));
    // }

    SaveCandidate(benchCandidates: any): Observable<ApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');

        return this.http.post(this.candidate_api + '/SaveCandidate', benchCandidates, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    // downloadResumeFile(fileName: string, fileType: string): Observable<Blob> {
    //     let headers = new HttpHeaders();
    //     headers.append('Content-Type', 'application/json');
    //     headers.append('responseType', 'arrayBuffer');

    //     return this.http.get(this.marketingdashboard_api + '/DownloadResume/' + fileName + '/' + fileType, { responseType: 'blob' })
    //         .pipe(map((response: Blob) => response)
    //             , catchError((error: Response) => {
    //                 let errorText = this._errorService.getErrorMessage(error);
    //                 return observableThrowError(errorText);
    //             }));
    // }

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

}