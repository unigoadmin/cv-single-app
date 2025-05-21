import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { BaseService } from 'src/@shared/services/base.service';
import { environment } from 'src/environments/environment';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { ErrorService } from 'src/@shared/services';
import { ApiResponse } from '../models/apiresponse';
import { BenchScheduleNotes } from '../models/benchschedulenotes';

@Injectable({
    providedIn: 'root'
})
export class InterviewsService extends BaseService {

    public interviewsURI: string = environment.APIServerUrl + "Interviews";

    constructor(private http: HttpClient, private _errorService: ErrorService) {
        super();
    }

    GetInterviewsBySubmissionId(SubmissionId: number, CompanyId: number, UserId: string) {
        return this.http.get(this.interviewsURI + '/GetInterviewsBySubmissionId/' + SubmissionId + '/' + CompanyId + '/' + UserId)
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    GetAllInterviews(InterviewsFilter:any) {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        let body = JSON.stringify(InterviewsFilter);
        return this.http.post(this.interviewsURI + '/GetAllInterviews',body,{headers: headers})
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    GetInterviewStatus(companyId: number) {
        return this.http.get(this.interviewsURI + '/GetInterviewStatus/' + companyId)
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    UpdateInterview(schedule: any) {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        let body = JSON.stringify(schedule);
        return this.http.post(this.interviewsURI + '/InsertInterviewRecord', body, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }


    UpdateInterviewStatus(submission: any) {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        let body = JSON.stringify(submission);
        return this.http.post(this.interviewsURI + '/UpdateInterviewStatus', body, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    GetAllInterviewsByCandidate(CompanyId: number, CandidateId: number, UserId: string) {
        return this.http.get(this.interviewsURI + '/GetAllInterviewsByCandidateId/' + CompanyId + '/' + CandidateId + '/' + UserId)
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    GetBenchScheduleNotes(benchScheduleId: number) {
        return this.http.get(this.interviewsURI + '/GetBenchScheduleNotes/' + benchScheduleId)
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    AddBenchScheduleNotes(benchScheduleNotes: BenchScheduleNotes) {
        let body = JSON.stringify(benchScheduleNotes);
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.post(this.interviewsURI + '/AddBenchScheduleNotes', body, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    GetInterviewStatusLabels(companyId: number) {
        return this.http.get(this.interviewsURI + '/GetInterviewStatusLabels/' + companyId)
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    GetInterviewActivityLog(CompanyId: number, InterviewId: number) {
        return this.http.get(this.interviewsURI + '/GetInterviewActivity/' + InterviewId+"/"+CompanyId)
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    
      }

}