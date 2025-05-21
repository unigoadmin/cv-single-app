import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { BaseService } from 'src/@shared/services/base.service';
import { environment } from 'src/environments/environment';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { ErrorService } from 'src/@shared/services';
import { WCApiResponse } from '../models/wc-apiresponse';
import { TimesheetMasterNotes } from '../models/timesheetmasternotes';

@Injectable({
    providedIn: 'root'
})
export class TimesheetService extends BaseService
{
    timesheet_api = environment.APIServerUrl + "Timesheets";
    constructor(private http: HttpClient,
        private _errorService: ErrorService) {
        super();
    }

    GetTimesheetsManagerView(timesheetfilter) {   
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');    
        let body = JSON.stringify(timesheetfilter);
        return this.http.post(this.timesheet_api + '/GetTimesheetsManagerView', body, { headers: headers })
        .pipe(map(response => <WCApiResponse>response)
        , catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));
    }

    GetTimesheetActivityLogs(timesheetId:number,companyId:number){
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.timesheet_api + '/GetActivityLogs/' + timesheetId +'/'+companyId, { headers: headers })
        .pipe(map(response => <WCApiResponse>response)
            , catchError((error: Response) => {
                let errorText = this._errorService.getErrorMessage(error);
                return observableThrowError(errorText);
            }));
    }

    GetTimesheetNotes(timesheetId:number,companyId:number){
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.timesheet_api + '/GetComments/' + timesheetId +'/'+companyId, { headers: headers })
        .pipe(map(response => <WCApiResponse>response)
            , catchError((error: Response) => {
                let errorText = this._errorService.getErrorMessage(error);
                return observableThrowError(errorText);
            }));
    }

    SaveComments(tsnotes:TimesheetMasterNotes){
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        let body = JSON.stringify(tsnotes); 
        return this.http.post(this.timesheet_api + '/SaveComments', body, { headers: headers })
        .pipe(map(response => <WCApiResponse>response)
        , catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));
    }

    UpdateTimesheetStatus(TimeseetApproved){
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        let body = JSON.stringify(TimeseetApproved);
        return this.http.post(this.timesheet_api + '/UpdateTimeSheetStatus', body, { headers: headers })
        .pipe(map(response => <WCApiResponse>response)
        , catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));
    }
    TimesheetConfiguration(timesheet){
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        let body = JSON.stringify(timesheet); 
        console.log(body)
        return this.http.post(this.timesheet_api + '/TimesheetConfiguration', body, { headers: headers })
        .pipe(map(response => <WCApiResponse>response)
        , catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));
    }
    GetTimesheetConfiguration(Id:number){
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.timesheet_api + '/GetTimesheetConfiguration/' + Id, { headers: headers })
        .pipe(map(response => <WCApiResponse>response)
            , catchError((error: Response) => {
                let errorText = this._errorService.getErrorMessage(error);
                return observableThrowError(errorText);
            }));
    }
    GetTimeSheetNotificationSettings(Id:number){
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.timesheet_api + '/GetTimesheetNotificationDetails/' + Id, { headers: headers })
        .pipe(map(response => <WCApiResponse>response)
            , catchError((error: Response) => {
                let errorText = this._errorService.getErrorMessage(error);
                return observableThrowError(errorText);
            }));
    }
    AddTimesheetNotification(timesheet){
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        let body = JSON.stringify(timesheet); 
        return this.http.post(this.timesheet_api + '/TimesheetNotification', body, { headers: headers })
        .pipe(map(response => <WCApiResponse>response)
        , catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));
    }

    DeleteTimesheets(timesheetDelete){
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        let body = JSON.stringify(timesheetDelete); 
        return this.http.post(this.timesheet_api + '/DeleteTimesheets', body, { headers: headers })
        .pipe(map(response => <WCApiResponse>response)
        , catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));


    }

    GetTimesheetsByAssignment(timesheetfilter) {   
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');    
        let body = JSON.stringify(timesheetfilter);
        return this.http.post(this.timesheet_api + '/GetTimesheetsByAssignment', body, { headers: headers })
        .pipe(map(response => <WCApiResponse>response)
        , catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));
    }

    GenerateMissingTimesheets(CompanyId:number,AssignmentId:number){
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.timesheet_api + '/GenerateMissingTimesheets/' + CompanyId +'/'+AssignmentId, { headers: headers })
        .pipe(map(response => <WCApiResponse>response)
            , catchError((error: Response) => {
                let errorText = this._errorService.getErrorMessage(error);
                return observableThrowError(errorText);
            }));
    }
}