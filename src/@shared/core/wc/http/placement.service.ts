import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { BaseService } from 'src/@shared/services/base.service';
import { environment } from 'src/environments/environment';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { AuthenticationService, ErrorService } from 'src/@shared/services';
import { WCApiResponse } from '../models/wc-apiresponse';
import { EmployerProfile } from '../models/employerprofile';
import { ApiResponse } from 'src/@cv/models/apiresponse';

@Injectable({
    providedIn: 'root'
})
export class PlacementService extends BaseService {
    confirmation_api = environment.APIServerUrl + 'Confirmation';
    talentCentral_api = environment.APIServerUrl + 'TalentCentral';
    placement_api = environment.APIServerUrl + 'Placement';
    AuthUrl = environment.APIServerUrl + "Authentication";
    assignment_api = environment.APIServerUrl + "Assignments";
    worker_api = environment.APIServerUrl + "Worker";
    timesheet_api = environment.APIServerUrl + "Timesheets";
    candidate_api = environment.APIServerUrl + "Candidates";
    settings_api = environment.APIServerUrl + "Settings";

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
        return this.http.get(this.placement_api + '/GetBenchSubUsers/' + companyId, { headers: headers })
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
    getPlacements(companyId, userId): Observable<WCApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.placement_api + '/GetPlacements/' + companyId + '/' + userId, { headers: headers })
            .pipe(map(response => <WCApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }
    savePlacements(Placement): Observable<WCApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        let body = JSON.stringify(Placement)
        return this.http.post(this.placement_api + '/SaveNewPlacement', body, { headers: headers })
            .pipe(map(response => <WCApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }
    GetPlacementByIdForEdit(companyId, placementid): Observable<WCApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.placement_api + '/GetPlacementByIdForEdit/' + companyId + '/' + placementid, { headers: headers })
            .pipe(map(response => <WCApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }
    GetPlacementByIdForOnBoarding(companyId, placementid): Observable<WCApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.placement_api + '/GetPlacementByIdForOnBoarding/' + companyId + '/' + placementid, { headers: headers })
            .pipe(map(response => <WCApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }
    OnBoardingPlacement(onboarding): Observable<WCApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        let body = JSON.stringify(onboarding)
        return this.http.post(this.placement_api + '/OnBoardingPlacement', body, { headers: headers })
            .pipe(map(response => <WCApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }
    GetAllAssignments(companyId): Observable<WCApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.assignment_api + '/GetAllAssignments/' + companyId, { headers: headers })
            .pipe(map(response => <WCApiResponse>response)
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
            .pipe(map(response => <WCApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    EditAssignment(assignment) {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        let body = JSON.stringify(assignment)
        return this.http.post(this.assignment_api + '/UpdateAssignmentMaster', body, { headers: headers })
            .pipe(map(response => <WCApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }
    
    GetCompanyDetails(id): Observable<WCApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.assignment_api + '/GetCompanyDetails/' + id, { headers: headers })
            .pipe(map(response => <WCApiResponse>response)
                , catchError((error) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    getEmployeeAssign(companyID: number): Observable<WCApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.assignment_api + '/GetEmployees/' + companyID, { headers: headers })
            .pipe(map(response => <WCApiResponse>response)
                , catchError((error) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }
    GetAssignmentById(assignmentID, companyId) {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.assignment_api + '/GetAssignmentById/' + assignmentID + '/' + companyId, { headers: headers })
            .pipe(map(response => <WCApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }
    GetEmployees(companyId) {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.worker_api + '/GetEmployees/' + companyId, { headers: headers })
            .pipe(map(response => <WCApiResponse>response)
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
            .pipe(map(response => <WCApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }
    GetEmployeeByID(empid, companyId) {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.worker_api + '/GetEmployeeByID/' + empid + '/' + companyId, { headers: headers })
            .pipe(map(response => <WCApiResponse>response)
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
            .pipe(map(response => <WCApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }
    GetTimesheetDayDetails(timesheetid,companyId) {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.timesheet_api + '/GetTimesheetDayDetails/' + timesheetid +'/'+ companyId, { headers: headers })
            .pipe(map(response => <WCApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }
    GetTimesheetConfiguration(companyId) {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.timesheet_api + '/GetTimesheetConfiguration/' + companyId, { headers: headers })
            .pipe(map(response => <WCApiResponse>response)
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
            .pipe(map(response => <WCApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }
    getWebAPITimeSheetUploadUrlemp(id): string {
        let loginUser = this.authService.getLoginUser();
        return this.timesheet_api + '/UploadTimesheetDocuments/' + loginUser.Company.Id + "/" + id;
    }
    DeleteTimesheetDoc(id, employeeid,companyId) {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.timesheet_api + '/DeleteTimesheetDoc/' + id + "/" + employeeid +"/"+companyId, { headers: headers })
            .pipe(map(response => <WCApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }
    getPlacementActivityLog(placementId:number,companyId:number){
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.placement_api + '/GetPlacementActivity/' + placementId+"/"+companyId, { headers: headers })
            .pipe(map(response => <WCApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
        
      }

      getEmployeeActiviyLog(EmployeeID:number,companyID:number){
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.worker_api + '/GetEmployeeActivity/' + EmployeeID+"/"+companyID, { headers: headers })
        .pipe(map(response => <WCApiResponse>response)
            , catchError((error: Response) => {
                let errorText = this._errorService.getErrorMessage(error);
                return observableThrowError(errorText);
            }));
        
      }

      getAssignmentActiviyLog(AssignmentID:number,companyID:number){
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.assignment_api + '/GetAssignmentsActivity/' + AssignmentID+"/"+companyID, { headers: headers })
        .pipe(map(response => <WCApiResponse>response)
            , catchError((error: Response) => {
                let errorText = this._errorService.getErrorMessage(error);
                return observableThrowError(errorText);
            }));
        
      }
      deletePlacement(placement){
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        let body = JSON.stringify(placement);
        return this.http.post(this.placement_api + '/DeletePlacement', body, { headers: headers })
        .pipe(map(response => <WCApiResponse>response)
            , catchError((error: Response) => {
                let errorText = this._errorService.getErrorMessage(error);
                return observableThrowError(errorText);
            }));
      }
      RejectPlacement(placement){
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        let body = JSON.stringify(placement);
        return this.http.post(this.placement_api + '/RejectPlacement', body, { headers: headers })
        .pipe(map(response => <WCApiResponse>response)
            , catchError((error: Response) => {
                let errorText = this._errorService.getErrorMessage(error);
                return observableThrowError(errorText);
            }));
      }
      GetExistingMSADocument(accountId,companyID){
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.placement_api + '/GetExistingMSADocument/' + accountId+"/"+companyID, { headers: headers })
        .pipe(map(response => <WCApiResponse>response)
            , catchError((error: Response) => {
                let errorText = this._errorService.getErrorMessage(error);
                return observableThrowError(errorText);
            }));
      }

      TerminateEmployee(employee){
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        let body = JSON.stringify(employee);
        return this.http.post(this.worker_api + '/TerminateEmployee', body, { headers: headers })
        .pipe(map(response => <WCApiResponse>response)
            , catchError((error: Response) => {
                let errorText = this._errorService.getErrorMessage(error);
                return observableThrowError(errorText);
            }));
    }

    GetEmployeeAssignemnts(employeeId,companyID){
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.worker_api+ '/GetEmployeeAssignemnts/'+employeeId+'/'+companyID, { headers: headers })
        .pipe(map(response => <WCApiResponse>response)
            , catchError((error: Response) => {
                let errorText = this._errorService.getErrorMessage(error);
                return observableThrowError(errorText);
            }));
    }

    CheckCandidateByEmail(CandidateSearch){
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        let body = JSON.stringify(CandidateSearch);
        return this.http.post(this.candidate_api + '/VerifyCandidateByEmail', body, { headers: headers })
        .pipe(map(response => <WCApiResponse>response)
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
        .toPromise().then(response => <WCApiResponse>response);
    }

    SearchEmployeeByEmail(searchparams) {
        let body=JSON.stringify(searchparams);
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.post(this.worker_api + '/SearchEmployeeByEmail',body, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    DownloadTimeSheetDOC(fileName: string, fileType: string,CompanyId:number): Observable<Blob> {
        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        headers.append('responseType', 'arrayBuffer');
        
        return this.http.get(this.timesheet_api + '/DownloadTimesheetDOC/' + fileName + '/' + fileType + '/'+ CompanyId, { responseType: 'blob' })
            .pipe(map((response:Blob) => response)
            ,catchError((error: Response) => {
                let errorText = this._errorService.getErrorMessage(error);
                return observableThrowError(errorText);
            }));
    }

    CheckEmployeeMasterFromEmployee(employeeverify){
        let body = JSON.stringify(employeeverify);
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        
        return this.http.post(this.worker_api+ '/ValidateEmployeeFromEmployeeMaster',body, { headers: headers })
        .pipe(map(response =><ApiResponse>response)
        ,catchError((error) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));
      }

      async SyncCheckWorkerByEmail(CandidateSearch){
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        let body = JSON.stringify(CandidateSearch);
        return await this.http.post(this.worker_api + '/VerifyEistingWorker', body, { headers: headers })
        .toPromise().then(response => <WCApiResponse>response);
    }

    GetWorkerCentralSummary(dashboardFilters:any){
        let body = JSON.stringify(dashboardFilters);
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.post(this.worker_api + '/GetWorkerCentralSummary', body, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    GetWorkerCentralHeadCount(dashboardFilters:any){
        let body = JSON.stringify(dashboardFilters);
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.post(this.worker_api + '/GetWorkerCentralHeadCount', body, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    SearchCandidates(benchCandidateSearch: any): Observable<ApiResponse> {
        let headers = new HttpHeaders();
            headers =  headers.append("Content-Type", 'application/json');
            return this.http.post(this.placement_api + '/SearchCandidates', benchCandidateSearch, { headers: headers })
                 .pipe(map(response => <ApiResponse>response)
                ,catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
      }

      CreateConsultantUser(employee:any): Observable<WCApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        let body = JSON.stringify(employee)
        return this.http.post(this.placement_api + '/CreateConsultantUser', body, { headers: headers })
            .pipe(map(response => <WCApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    UpdateEmployeeWebsiteStatus(employee:any): Observable<WCApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        let body = JSON.stringify(employee)
        return this.http.post(this.worker_api + '/UpdateEmployeeeWithUser', body, { headers: headers })
            .pipe(map(response => <WCApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    LinkWorkerWithUser(employee:any): Observable<WCApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        let body = JSON.stringify(employee)
        return this.http.post(this.worker_api + '/LinkWorkerWithUser', body, { headers: headers })
            .pipe(map(response => <WCApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    GetTimesheetPrintDetails(timesheetid:number,companyId:number) {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.timesheet_api + '/GetTimesheetDayDetailsForPrint/' + timesheetid +'/'+ companyId, { headers: headers })
            .pipe(map(response => <WCApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    GetWorkPermitsByCompanyId(companyId: number): Observable<WCApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.settings_api + '/GetWorkPermitsByCompanyIdForSelect/' + companyId,{ headers: headers })
        .pipe(map(response => <WCApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
      }
      
}