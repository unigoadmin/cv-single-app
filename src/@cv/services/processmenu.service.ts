import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { BaseService } from 'src/@shared/services/base.service';
import { environment } from 'src/environments/environment';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { AuthenticationService, ErrorService } from 'src/@shared/services';
import { ApiResponse } from '../models/apiresponse';

@Injectable({
    providedIn: 'root'
})
export class ProcessMenuService extends BaseService {
    confirmation_api = environment.APIServerUrl + 'Confirmation';
    talentCentral_api = environment.APIServerUrl + 'TalentCentral';
    placement_api = environment.APIServerUrl + 'Placement';
    AuthUrl = environment.APIServerUrl + "Authentication";
    assignment_api = environment.APIServerUrl + "Assignments";
    worker_api = environment.APIServerUrl + "Worker";
    timesheet_api = environment.APIServerUrl + "Timesheets";
    candidate_api = environment.APIServerUrl + "Candidates";
    baseUrl = environment.APIServerUrl + 'Common';
    companyURI = environment.APIServerUrl + 'company';

    constructor(private http: HttpClient,
        private _errorService: ErrorService,
        private authService: AuthenticationService
    ) {
        super();
    }
    GetAccounts(companyID: number): Observable<any[]> {
        return this.http.get(this.talentCentral_api + '/GetAllAccounts/' + companyID)
            .pipe(map(response => <any[]>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }
    getAtsSubUsers(companyId): Observable<any> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.talentCentral_api + '/GetBenchSubUsers/' + companyId, { headers: headers })
            .pipe(map(response => <any>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    getInternalUsersByModuleId(companyId: number, ModuleId: string): Observable<any> {
        return this.http.get(this.baseUrl + '/GetInternalUsers/' + companyId + '/' + ModuleId)
            .pipe(map(response => <any>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));

    }
    getEmloyeeCentralUsers(companyId): Observable<any> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.worker_api + '/GetUsers/' + companyId, { headers: headers })
            .pipe(map(response => <any>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }
    getPlacements(companyId, userId): Observable<ApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.placement_api + '/GetPlacements/' + companyId + '/' + userId, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }
    savePlacements(Placement): Observable<ApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        let body = JSON.stringify(Placement)
        return this.http.post(this.placement_api + '/SavePlacement', body, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }
    GetPlacementByIdForOnBoarding(companyId, placementid): Observable<ApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.placement_api + '/GetPlacementByIdForOnBoarding/' + companyId + '/' + placementid, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }
    OnBoardingPlacement(onboarding): Observable<ApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        let body = JSON.stringify(onboarding)
        return this.http.post(this.placement_api + '/OnBoardingPlacement', body, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }
    GetAllAssignments(companyId): Observable<ApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.assignment_api + '/GetAllAssignments/' + companyId, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }
    SaveAssignment(assignment) {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        let body = JSON.stringify(assignment)
        return this.http.post(this.assignment_api + '/SaveAssignmentMaster', body, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }
    GetCompanyDetails(id): Observable<ApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.assignment_api + '/GetCompanyDetails/' + id, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    getEmployeeAssign(companyID: number): Observable<ApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.assignment_api + '/GetEmployees/' + companyID, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }
    GetAssignmentById(assignmentID, companyId) {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.assignment_api + '/GetAssignmentById/' + assignmentID + '/' + companyId, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }
    GetEmployees(companyId) {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.worker_api + '/GetEmployees/' + companyId, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }
    SaveEmployeeMaster(employee) {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        let body = JSON.stringify(employee)
        return this.http.post(this.worker_api + '/SaveEmployeeMaster', body, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }
    GetEmployeeByID(empid, companyId) {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.worker_api + '/GetEmployeeByID/' + empid + '/' + companyId, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }
    GetTimesheets(timesheet) {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        let body = JSON.stringify(timesheet)
        return this.http.post(this.timesheet_api + '/GetTimesheets', body, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }
    GetTimesheetDayDetails(timesheetid, companyid) {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.timesheet_api + '/GetTimesheetDayDetails/' + timesheetid + '/' + companyid, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }
    GetTimesheetConfiguration(companyId) {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.timesheet_api + '/GetTimesheetConfiguration/' + companyId, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }
    UpdateTimesheet(timesheet) {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        let body = JSON.stringify(timesheet)
        return this.http.post(this.timesheet_api + '/UpdateTimesheet', body, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }
    getWebAPITimeSheetUploadUrlemp(id): string {
        let loginUser = this.authService.getLoginUser();
        return this.timesheet_api + '/UploadTimesheetDocuments/' + loginUser.Company.Id + "/" + id;
    }
    DeleteTimesheetDoc(id, employeeid) {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.timesheet_api + '/DeleteTimesheetDoc/' + id + "/" + employeeid, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }
    getPlacementActivityLog(placementId: number, companyId: number) {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.placement_api + '/GetPlacementActivity/' + placementId + "/" + companyId, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));

    }

    getEmployeeActiviyLog(EmployeeID: number, companyID: number) {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.worker_api + '/GetEmployeeActivity/' + EmployeeID + "/" + companyID, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));

    }

    getAssignmentActiviyLog(AssignmentID: number, companyID: number) {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.worker_api + '/GetAssignmentsActivity/' + AssignmentID + "/" + companyID, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));

    }
    deletePlacement(placement) {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        let body = JSON.stringify(placement);
        return this.http.post(this.placement_api + '/DeletePlacement', body, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    GetExistingMSADocument(accountId, companyID) {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.placement_api + '/GetExistingMSADocument/' + accountId + "/" + companyID, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    TerminateEmployee(employee) {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        let body = JSON.stringify(employee);
        return this.http.post(this.worker_api + '/TerminateEmployee', body, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    GetEmployeeAssignemnts(employeeId, companyID) {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.worker_api + '/GetEmployeeAssignemnts/' + employeeId + '/' + companyID, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    CheckCandidateByEmail(CandidateSearch) {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        let body = JSON.stringify(CandidateSearch);
        return this.http.post(this.candidate_api + '/VerifyCandidateByEmail', body, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    // async SyncCheckCandidateByEmail(CandidateSearch){
    //     let headers = new HttpHeaders();
    //     headers = headers.append("Content-Type", 'application/json');
    //     let body = JSON.stringify(CandidateSearch);
    //     return await this.http.post(this.candidate_api + '/VerifyCandidateByEmail', body, { headers: headers })
    //     .toPromise().then(response => <ApiResponse>response);
    // }

    SearchEmployeeByEmail(searchparams) {
        let body = JSON.stringify(searchparams);
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.post(this.worker_api + '/SearchEmployeeByEmail', body, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    GetSessionSettingValues(companyId: number): Observable<ApiResponse> {
        return this.http.get(this.companyURI + '/GetIdleGetSessionConfig/' + companyId)
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }




}