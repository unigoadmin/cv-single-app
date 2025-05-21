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

  export class CandidateService extends BaseService{
    candidates_api = environment.APIServerUrl + 'Candidates';
    marketingdashboard_api = environment.APIServerUrl+'MarketingDashboard';
    constructor(private http: HttpClient,
      private _errorService: ErrorService){
        super(); 
    }

    SearchCandidates(benchCandidateSearch: any): Observable<ApiResponse> {
        let headers = new HttpHeaders();
            headers =  headers.append("Content-Type", 'application/json');
            return this.http.post(this.candidates_api + '/SearchCandidates', benchCandidateSearch, { headers: headers })
                 .pipe(map(response => <ApiResponse>response)
                ,catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
      }

      AddToBench(addBench:any){
        let headers = new HttpHeaders();
            headers =  headers.append("Content-Type", 'application/json');
            return this.http.post(this.candidates_api + '/AddToBench', addBench, { headers: headers })
                 .pipe(map(response => <ApiResponse>response)
                ,catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));

      }

      AssignSalesReps(SalesRespsData:any){
        let headers = new HttpHeaders();
            headers =  headers.append("Content-Type", 'application/json');
            return this.http.post(this.candidates_api + '/AssigneSalesReps', SalesRespsData, { headers: headers })
                 .pipe(map(response => <ApiResponse>response)
                ,catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));

      }

    CandidateAssignToRecruiters(SalesRespsData: any) {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.post(this.candidates_api + '/CandidateAssignToRecruiters', SalesRespsData, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

      RemoveFromBench(addBench:any){
        let headers = new HttpHeaders();
            headers =  headers.append("Content-Type", 'application/json');
            return this.http.post(this.candidates_api + '/RemoveFromBench', addBench, { headers: headers })
                 .pipe(map(response => <ApiResponse>response)
                ,catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
      }

      RemoveFromBenchMultiple(addBench:any){
        let headers = new HttpHeaders();
            headers =  headers.append("Content-Type", 'application/json');
            return this.http.post(this.candidates_api + '/RemoveFromBenchMultiple', addBench, { headers: headers })
                 .pipe(map(response => <ApiResponse>response)
                ,catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
      }

      UpdateCandidateStatus(candidate:any){
        let headers = new HttpHeaders();
        headers =  headers.append("Content-Type", 'application/json');
        return this.http.post(this.candidates_api + '/UpdateCandidateStatus', candidate, { headers: headers })
             .pipe(map(response => <ApiResponse>response)
            ,catchError((error: Response) => {
                let errorText = this._errorService.getErrorMessage(error);
                return observableThrowError(errorText);
            }));
      }

      GetCandidateActivityLog(CandidateId:number,companyId:number){
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.candidates_api + '/GetCandidateActivity/' + CandidateId+"/"+companyId, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
      }

      ShareCandidates(ReportRecurrence: any): Observable<ApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.post(this.candidates_api + '/ShareCandidates', ReportRecurrence, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    fetchCandidateStatus(companyId: number):Observable<ApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
    
        return this.http.get<ApiResponse>(this.candidates_api + '/GetCandidateStatusLabelsForEdit/' + companyId,{ headers: headers })
           .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    getBenchSubUsers(companyId: number): Observable<any[]> {
        return this.http.get(this.marketingdashboard_api + '/GetBenchSubUsers/' + companyId )
        .pipe(map(response => <any[]>response)
        ,catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));
    
      }

    downloadAttachment(filedetails:any): Observable<Blob> {
        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        headers.append('responseType', 'arrayBuffer');
        
        return this.http.post(this.candidates_api + '/DownloadCandidateResume',filedetails, { responseType: 'blob' })
            .pipe(map((response:Blob) => response)
            ,catchError((error: Response) => {
                let errorText = this._errorService.getErrorMessage(error);
                return observableThrowError(errorText);
            }));
    }  

      


  }