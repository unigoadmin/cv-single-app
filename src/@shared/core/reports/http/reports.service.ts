import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { BaseService } from 'src/@shared/services/base.service';
import { environment } from 'src/environments/environment';
import { throwError as observableThrowError,Observable } from 'rxjs';
import { ErrorService } from 'src/@shared/services';
import { ApiResponse } from 'src/@cv/models/apiresponse';
import { SubUsers } from 'src/@shared/models/common/subusers';

@Injectable({
    providedIn: 'root'
  })

  export class ReportsService extends BaseService{
    reports_api = environment.APIServerUrl + 'Reports';
    marketingdashboard_api = environment.APIServerUrl + 'MarketingDashboard';
    constructor(private http: HttpClient,
      private _errorService: ErrorService){
        super(); 
    }

    GetSubmissions(SubmissionsSearch: any): Observable<ApiResponse> {
        let headers = new HttpHeaders();
            headers =  headers.append("Content-Type", 'application/json');
            return this.http.post(this.reports_api + '/GetSubmissions', SubmissionsSearch, { headers: headers })
                 .pipe(map(response => <ApiResponse>response)
                ,catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
      }
      GetReportsByCategory(CompanyId,CategoryId): Observable<ApiResponse> {
        let headers = new HttpHeaders();
            headers =  headers.append("Content-Type", 'application/json');
            return this.http.get(this.reports_api + '/GetReportsByCategory/'+CompanyId+'/'+CategoryId, { headers: headers })
                 .pipe(map(response => <ApiResponse>response)
                ,catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
      }
      GetReportFilters(CompanyId,ReportTypeId,ReportId): Observable<ApiResponse> {
        let headers = new HttpHeaders();
            headers =  headers.append("Content-Type", 'application/json');
            return this.http.get(this.reports_api + '/GetReportFilters/'+CompanyId+'/'+ReportTypeId+'/'+ReportId, { headers: headers })
                 .pipe(map(response => <ApiResponse>response)
                ,catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
      }
      RunReport(runReport: any): Observable<ApiResponse> {
        let headers = new HttpHeaders();
            headers =  headers.append("Content-Type", 'application/json');
            return this.http.post(this.reports_api + '/RunReport', runReport, { headers: headers })
                 .pipe(map(response => <ApiResponse>response)
                ,catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
      }
      SaveCustomReports(saveReport: any): Observable<ApiResponse> {
        let headers = new HttpHeaders();
            headers =  headers.append("Content-Type", 'application/json');
            return this.http.post(this.reports_api + '/SaveCustomReports', saveReport, { headers: headers })
                 .pipe(map(response => <ApiResponse>response)
                ,catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
      }

      GetCustomReports(CompanyId,ReportTypeId): Observable<ApiResponse> {
        let headers = new HttpHeaders();
            headers =  headers.append("Content-Type", 'application/json');
            return this.http.get(this.reports_api + '/GetCustomReports/'+CompanyId+'/'+ReportTypeId, { headers: headers })
                 .pipe(map(response => <ApiResponse>response)
                ,catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
      }

      SaveRecurrence(ReportRecurrence:any):Observable<ApiResponse>{
        let headers = new HttpHeaders();
        headers =  headers.append("Content-Type", 'application/json');
        return this.http.post(this.reports_api + '/SaveReportRecurrance', ReportRecurrence, { headers: headers })
             .pipe(map(response => <ApiResponse>response)
            ,catchError((error: Response) => {
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
    getRecurrence(CompanyId:number,TaskId:number,ReportId:number):Observable<ApiResponse>{
        let headers = new HttpHeaders();
        headers =  headers.append("Content-Type", 'application/json');
        return this.http.get(this.reports_api + '/GetReportTaskRecurrence/'+TaskId+'/'+ReportId, { headers: headers })
             .pipe(map(response => <ApiResponse>response)
            ,catchError((error: Response) => {
                let errorText = this._errorService.getErrorMessage(error);
                return observableThrowError(errorText);
            }));
    }

    DeleteCustomReports(deleteReport: any): Observable<ApiResponse> {
        let headers = new HttpHeaders();
            headers =  headers.append("Content-Type", 'application/json');
            return this.http.post(this.reports_api + '/DeleteCustomReport', deleteReport, { headers: headers })
                 .pipe(map(response => <ApiResponse>response)
                ,catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
      }

  }