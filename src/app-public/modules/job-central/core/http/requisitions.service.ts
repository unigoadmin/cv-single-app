import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseService, ErrorService } from "src/@shared/services";
import { environment } from 'src/environments/environment';
import { ApiResponse } from "../model/apiresponse";
import { catchError, map } from "rxjs/operators";
import { throwError as observableThrowError, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RequisitionService extends BaseService {
    requisitins_api = environment.APIServerUrl + 'Requisition';

    constructor(private http: HttpClient,
        private _errorService: ErrorService) { super(); }


    GetNotes(responseid, companyID): Observable<ApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.requisitins_api + '/GetRequisitionsNotes/' + responseid + '/' + companyID, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    GetRequisitions(reqfilters: any): Observable<ApiResponse> {
        let body = JSON.stringify(reqfilters);
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.post(this.requisitins_api + '/GetRequisitions', body, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));

    }

    SaveNotes(responseNotes: any) {
        let body = JSON.stringify(responseNotes);
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.post(this.requisitins_api + '/SaveRequisitionNotes', body, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    JobRequisitonMapping(JobMapping: any): Observable<ApiResponse> {
        let body = JSON.stringify(JobMapping);
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');

        return this.http.post(this.requisitins_api + '/MapRequistionToJob', body, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    GetJobsWithRequisition(reqfilters: any): Observable<ApiResponse> {
        let body = JSON.stringify(reqfilters);
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');

        return this.http.post(this.requisitins_api + '/GetActiveJobsWithReqMapping', body, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    GetRequisitionDetailsById(responseid, companyID): Observable<ApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.requisitins_api + '/GetRequisitionById/' + companyID + '/' + responseid, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    UpdateRequisition(Requisition: any) {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.post(this.requisitins_api + '/UpdateRequisition', Requisition, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    JobRequisitonMultipleMapping(JobMapping: any): Observable<ApiResponse> {
        let body = JSON.stringify(JobMapping);
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');

        return this.http.post(this.requisitins_api + '/MapMultipleRequistionToJob', body, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    UpdateRequistionStatus(viewInfo: any) {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');

        return this.http.post(this.requisitins_api + '/UpdateRequisitionStatus', viewInfo, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    ApplicantSubmission(Submission: any) {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.post(this.requisitins_api + '/RequistionSubmission', Submission, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    GetRequisitionSubmissionsList(companyId, responseId): Observable<ApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.requisitins_api + '/GetSubmissionsByRequisitiond/' + companyId + '/' + responseId, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    UpdateSubmissionStatus(viewInfo: any) {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');

        return this.http.post(this.requisitins_api + '/UpdateSubmissionStatus', viewInfo, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    GetRequsitionsExport(companyId): Observable<ApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.requisitins_api + '/ExportRequistons/' + companyId, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    GetCordinatorsPostingOwner(companyId): Observable<ApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.requisitins_api + '/GetCoordinatorsPostingOwners/' + companyId, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }


}


