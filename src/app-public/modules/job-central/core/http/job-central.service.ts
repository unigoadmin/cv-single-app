import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { BaseService } from 'src/@shared/services/base.service';
import { environment } from 'src/environments/environment';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { ErrorService } from 'src/@shared/services';
import { ApiResponse } from '../model/apiresponse';
import { BenchCandidate } from '../model/benchcandidate';
import { CandidateMasterNotes } from 'src/@shared/models/candidatemasternotes';
import { SubUsers } from 'src/@shared/models/common/subusers';


@Injectable({
    providedIn: 'root'
})
export class JobCentralService extends BaseService {
    jobsdashbord_api = environment.APIServerUrl + 'JobsDashboard';
    talentCentral_api = environment.APIServerUrl + 'TalentCentral';
    marketingdashboard_api = environment.APIServerUrl + 'MarketingDashboard';
    candidates_api = environment.APIServerUrl + 'Candidates';
    mailgun_api = environment.APIServerUrl + 'Mailgun';
    applicants_api = environment.APIServerUrl + 'Applicants';
    Filestore_api = environment.APIServerUrl + 'FileStore';
    common_api = environment.APIServerUrl + 'Common';
    response_api = environment.APIServerUrl + 'JobBoardResponses';
    jcsettings_api = environment.APIServerUrl + 'JCSettings';
    FormSettings_api = environment.APIServerUrl + 'FormSettings';
    publicjob_api = environment.APIServerUrl + 'PublicJobs';
    hotlistjob_api = environment.APIServerUrl + 'JobsHotList';

    constructor(private http: HttpClient,
        private _errorService: ErrorService,
        ) { super(); }
    getAllBenchJobs(jobsSearch: any): Observable<ApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.post(this.jobsdashbord_api + '/GetAllBenchJobs', jobsSearch, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }
    GetCandidatesByJob(companyID, jobId): Observable<ApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');

        return this.http.get(this.jobsdashbord_api + '/GetCandidatesByJob/' + companyID + '/' + jobId, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }
    GetBenchJobById(companyID, jobId): Observable<ApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.jobsdashbord_api + '/GetBenchJobById/' + companyID + '/' + jobId, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }
    GetJobMasterNotes(companyID, jobId): Observable<ApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.jobsdashbord_api + '/GetJobMasterNotes/' + companyID + '/' + jobId, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }
    AddJobMasterNotes(jobnotes: any): Observable<ApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.post(this.jobsdashbord_api + '/AddJobMasterNotes', jobnotes, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }
    GetCandidateMasterNotes(companyID, candidateid): Observable<ApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.candidates_api + '/GetCandidateMasterNotes/' + companyID + '/' + candidateid, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }
    AddCandidateMasterNotes(cannotes: any): Observable<ApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.post(this.candidates_api + '/AddCandidateMasterNotes', cannotes, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }
    public getBenchCandidateById(CompanyId: number, CandidateId: number): Observable<any> {
        return this.http.get(this.candidates_api + '/GetCandidateById/' + CompanyId + '/' + CandidateId)
            .pipe(map(response => <any>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));

    }
    GetJobsByCandidate(companyID, candidateId): Observable<ApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.jobsdashbord_api + '/GetJobsByCandidate/' + companyID + '/' + candidateId, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }
    AddJobMaster(job) {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.post(this.jobsdashbord_api + '/AddJobMaster', job, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }
    GetJobDetailsByJobID(companyID, jobId): Observable<ApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.jobsdashbord_api + '/GetJobDetailsByJobID/' + companyID + '/' + jobId, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }
    CandidateJobMaping(job) {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.post(this.jobsdashbord_api + '/CandidateJobMaping', job, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    ApplicantJobMaping(JobMapping: any) {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.post(this.jobsdashbord_api + '/ApplicantJobMaping', JobMapping, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    GetMailgunInbox(companyId: number) {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.mailgun_api + '/GetMailgunInbox/' + companyId, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    GetMailgunAttachments(companyId: number, InboxId: number) {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.mailgun_api + '/GetMailgunInbox/' + companyId, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    AddBenchScheduleNotes(benchScheduleNotes: CandidateMasterNotes) {
        let body = JSON.stringify(benchScheduleNotes);
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.post(this.candidates_api + '/AddCandidateMasterNotes', body, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }
    GetApplicantNotes(applicantId: number, companyId: number) {
        return this.http.get(this.candidates_api + '/GetApplicantNotes/' + companyId + '/' + applicantId)
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    GetResponsesNotes(responseId: number, companyId: number) {
        return this.http.get(this.response_api + '/GetJobBoardResponseNotes/' + responseId + '/' + companyId)
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    SaveResponseNotes(responseNotes: any) {
        let body = JSON.stringify(responseNotes);
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.post(this.response_api + '/SaveResponseNotes', body, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    IgnoreApplicant(appIgnore: any) {
        let body = JSON.stringify(appIgnore);
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.post(this.response_api + '/DeleteApplicant', body, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    UpdateApplicantViewed(viewInfo: any) {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');

        return this.http.post(this.response_api + '/UpdateApplicantViewed', viewInfo, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    // saveCandidate(benchCandidates: BenchCandidate): Observable<ApiResponse> {
    //     let headers = new HttpHeaders();
    //     headers = headers.append("Content-Type", 'application/json');

    //     return this.http.post(this.candidates_api + '/LoadCandidate', benchCandidates, { headers: headers })
    //         .pipe(map(response => <ApiResponse>response)
    //             , catchError((error: Response) => {
    //                 let errorText = this._errorService.getErrorMessage(error);
    //                 return observableThrowError(errorText);
    //             }));
    // }
    getBenchSubUsers(companyId: number): Observable<SubUsers[]> {
        return this.http.get(this.applicants_api + '/GetJobCentralUsers/' + companyId)
            .pipe(map(response => <SubUsers[]>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));

    }
    AssignApplicants(applicants: any): Observable<ApiResponse> {
        let body = JSON.stringify(applicants);
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');

        return this.http.post(this.response_api + '/AssignApplicantsToRecruiters', body, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }
    AssignSingleApplicants(applicants: any): Observable<ApiResponse> {
        let body = JSON.stringify(applicants);
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');

        return this.http.post(this.response_api + '/AssignSingleApplicantsToRecruiters', body, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    AssignMultipleApplicants(applicants: any): Observable<ApiResponse> {
        let body = JSON.stringify(applicants);
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');

        return this.http.post(this.response_api + '/AssignMultipleToRecruiters', body, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    getMyApplicants(applicantFilter: any): Observable<ApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.post(this.response_api + '/GetMyCandidateInbox', applicantFilter, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    getReveiwedApplicants(applicantFilter: any): Observable<ApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.post(this.applicants_api + '/GetSendForReviewedApplicants', applicantFilter, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    getUnAssignedApplicants(applicantFilter: any): Observable<ApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.post(this.applicants_api + '/GetUnAssignedAppicants', applicantFilter, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    JobboardResponses(applicantFilter: any): Observable<ApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.post(this.applicants_api + '/GetJobBoardResponses', applicantFilter, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    downloadApplicantResume(companyId: number, applicantId: number): Observable<Blob> {
        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        headers.append('responseType', 'arrayBuffer');

        return this.http.get(this.applicants_api + '/DownloadApplicantResume/' + companyId + '/' + applicantId, { responseType: 'blob' })
            .pipe(map((response: Blob) => response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    DownloadInboxResume(companyId: number, applicantId: number): Observable<Blob> {
        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        headers.append('responseType', 'arrayBuffer');

        return this.http.get(this.response_api + '/DownloadJobBoardResume/' + companyId + '/' + applicantId, { responseType: 'blob' })
            .pipe(map((response: Blob) => response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    ShareApplicants(ReportRecurrence: any): Observable<ApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.post(this.response_api + '/ShareApplicant', ReportRecurrence, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    GetCandidateHashTags(companyId: number): Observable<ApiResponse> {
        return this.http.get(this.applicants_api + '/GetHashTagsByCandidate/' + companyId)
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    GetJobCentralManagers(CompanyId: number): Observable<ApiResponse> {
        return this.http.get(this.applicants_api + '/GetJobCentralManagers/' + CompanyId)
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    GetJobCentralSettings(CompanyId: number): Observable<ApiResponse> {
        return this.http.get(this.jobsdashbord_api + '/GetJobCentralSettings/' + CompanyId)
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    SaveJobCentralSettings(JcSettings: any): Observable<ApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.post(this.jobsdashbord_api + '/SaveJobcentralSettings', JcSettings, { headers: headers })
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

    downloadResumeFile(fileName: string, fileType: string): Observable<Blob> {
        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        headers.append('responseType', 'arrayBuffer');

        return this.http.get(this.marketingdashboard_api + '/DownloadResume/' + fileName + '/' + fileType, { responseType: 'blob' })
            .pipe(map((response: Blob) => response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    ApplicantBackToInbox(appIgnore: any) {
        let body = JSON.stringify(appIgnore);
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.post(this.applicants_api + '/ApplicantBackToInbox', body, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    GetJobCentralSummary(dashboardFilters: any) {
        let body = JSON.stringify(dashboardFilters);
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.post(this.applicants_api + '/GetJobCentralSummary', body, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    ApplicantNotInterested(appIgnore: any) {
        let body = JSON.stringify(appIgnore);
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.post(this.response_api + '/ApplicantNotInterested', body, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    GetIgnoredApplicants(applicantFilter: any): Observable<ApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.post(this.applicants_api + '/GetIgnoredApplicants', applicantFilter, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    GetIgnoredResponses(applicantFilter: any): Observable<ApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.post(this.response_api + '/GetIgnoredResponses', applicantFilter, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    UpdateNotInterestedStatus(appIgnore: any) {
        let body = JSON.stringify(appIgnore);
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.post(this.applicants_api + '/UpdateNotInterestedStatus', body, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    ApplicantSedForReview(applicants: any): Observable<ApiResponse> {
        let body = JSON.stringify(applicants);
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');

        return this.http.post(this.response_api + '/SendForReview', body, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    // UpdateApplicant(applicants: any): Observable<ApiResponse> {
    //     let body = JSON.stringify(applicants);
    //     let headers = new HttpHeaders();
    //     headers = headers.append("Content-Type", 'application/json');

    //     return this.http.post(this.applicants_api + '/UpdateApplicant', body, { headers: headers })
    //         .pipe(map(response => <ApiResponse>response)
    //             , catchError((error: Response) => {
    //                 let errorText = this._errorService.getErrorMessage(error);
    //                 return observableThrowError(errorText);
    //             }));
    // }

    UpdateInboxResponse(applicants: any): Observable<ApiResponse> {
        let body = JSON.stringify(applicants);
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');

        return this.http.post(this.response_api + '/UpdateInboxResponse', body, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    NewApplicant(applicants: any): Observable<ApiResponse> {
        let body = JSON.stringify(applicants);
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');

        return this.http.post(this.applicants_api + '/AddNewApplicant', body, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    UpdateApplicantResume(applicants: any): Observable<ApiResponse> {
        let body = JSON.stringify(applicants);
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');

        return this.http.post(this.applicants_api + '/UpdateApplicantResume', body, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    UploadApplicantResume(file: File[]): Observable<any> {
        let formData: FormData = new FormData();
        formData.append("file", file[0]);

        return this.http.post(this.Filestore_api + '/UploadApplicantResume', formData)
            .pipe(map(response => <any>response)
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

    GetCandidateAssingees(companyId: number, CandidateId: number) {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.candidates_api + '/GetCandidateAssignees/' + companyId + '/' + CandidateId, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    CandidateRecruiterMapping(applicants: any): Observable<ApiResponse> {
        let body = JSON.stringify(applicants);
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');

        return this.http.post(this.candidates_api + '/CandidateRecruiterMapping', body, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    SaveCandidateFromApplicant(benchCandidates: BenchCandidate): Observable<ApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');

        return this.http.post(this.candidates_api + '/SaveCandidateFromApplicant', benchCandidates, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    CheckCandidateApplicantStatus(companyId: number, candidateId): Observable<ApiResponse> {
        return this.http.get(this.applicants_api + '/CheckCandidateApplicantStatus/' + companyId + '/' + candidateId + companyId)
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    UpdateApplicantStatus(viewInfo: any) {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');

        return this.http.post(this.response_api + '/UpdateApplicantStatus', viewInfo, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    SaveApplicantFromCandidate(applicantData: any): Observable<ApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');

        return this.http.post(this.applicants_api + '/SaveApplcantFromCandidate', applicantData, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    GetJobCentraLUnreadCount(CompanyId: number): Observable<ApiResponse> {
        return this.http.get(this.applicants_api + '/GetJobcentralUnreadCounts/' + CompanyId)
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    GetApplicantsByJob(applicantFilter: any): Observable<ApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');

        return this.http.post(this.jobsdashbord_api + '/GetApplicantsByJob', applicantFilter, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    GetApplicantsByJobId(companyID, jobId): Observable<ApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');

        return this.http.get(this.jobsdashbord_api + '/GetApplicantsByJob/' + companyID + '/' + jobId, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    SearchForApplicants(applicantData: any): Observable<ApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');

        return this.http.post(this.response_api + '/SearchApplicants', applicantData, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    getArchvedResponses(applicantFilter: any): Observable<ApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.post(this.applicants_api + '/GetArchivedResponses', applicantFilter, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    ViewResponseDetails(companyId: number, inboxId: number) {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.response_api + '/GetRespnseDetailsById/' + companyId + '/' + inboxId, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    uploadNotesAttachements(file: File[], companyId: number): Observable<ApiResponse> {
        let formData: FormData = new FormData();
        formData.append("file", file[0]);

        return this.http.post(this.Filestore_api + '/CandidateNotesAttachement/' + companyId, formData)
            .pipe(map(response => <any>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    downloadNotesAttachment(filedetails: any): Observable<Blob> {
        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        headers.append('responseType', 'arrayBuffer');

        return this.http.post(this.candidates_api + '/DownloadNotesAttachment', filedetails, { responseType: 'blob' })
            .pipe(map((response: Blob) => response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    GetApplicantAssingees(companyId: number, ResponseId: number) {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.response_api + '/GetApplicantRecruiters/' + ResponseId + '/' + companyId, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    ViewArchieveResponseDetails(companyId: number, inboxId: number) {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.response_api + '/GetArchieveRespnseDetailsById/' + companyId + '/' + inboxId, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    DeleteArchieveApplicant(companyId: number, inboxId: number) {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.response_api + '/DeleteArchieveApplicant/' + companyId + '/' + inboxId, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    AssignSingleArchieveApplicants(applicants: any): Observable<ApiResponse> {
        let body = JSON.stringify(applicants);
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');

        return this.http.post(this.response_api + '/AssignSingleArchiveApplicantToRecruiters', body, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    ManageApplicantStatus(ApplicantStatus): Observable<ApiResponse> {
        let body = JSON.stringify(ApplicantStatus);
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.post(this.jcsettings_api + '/ManageApplicantStatus', body, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    GetApplicantStatusList(companyId:number): Observable<ApiResponse> {
        return this.http.get(this.jcsettings_api + '/GetApplicantStatusList/' + companyId)
          .pipe(map(response => <ApiResponse>response)
            , catchError((error: Response) => {
              let errorText = this._errorService.getErrorMessage(error);
              return observableThrowError(errorText);
            }));
      }

      DeleteApplicantStatus(ApplicantStatus): Observable<ApiResponse> {
        let body = JSON.stringify(ApplicantStatus);
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.post(this.jcsettings_api + '/DeleteApplicantStatus', body, { headers: headers })
          .pipe(map(response => <ApiResponse>response)
            , catchError((error: Response) => {
              let errorText = this._errorService.getErrorMessage(error);
              return observableThrowError(errorText);
            }));
      }

      UpdateJobStatus(appIgnore: any) {
        let body = JSON.stringify(appIgnore);
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.post(this.jobsdashbord_api + '/UpdateJobStatus', body, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    GetDuplicateResponses(applicants: any): Observable<ApiResponse> {
        let body = JSON.stringify(applicants);
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');

        return this.http.post(this.response_api + '/GetDuplicateResponses', body, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    async SyncCheckApplicantByEmail(applicantSearch){
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        let body = JSON.stringify(applicantSearch);
        return await this.http.post(this.response_api + '/GetDuplicateResponses', body, { headers: headers })
        .toPromise().then(response => <ApiResponse>response);
    }

    GetRequisitionsWithJob(reqfilters:any): Observable<ApiResponse> {
        let body = JSON.stringify(reqfilters);
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');

        return this.http.post(this.jobsdashbord_api + '/GetRequisitionsWithJobMapping', body, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    GetRequisitionsByJob(reqfilters:any): Observable<ApiResponse> {
        let body = JSON.stringify(reqfilters);
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');

        return this.http.post(this.jobsdashbord_api + '/GetRequisitionsByJobId', body, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    fetchApplicantStatus(companyId: number):Observable<ApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');

        return this.http.get<ApiResponse>(this.response_api + '/GetApplicantStatusLabels/' + companyId,{ headers: headers })
           .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    GetJobCentralFormSettings(CompanyId: number,ModuleId:string): Observable<ApiResponse> {
        return this.http.get(this.FormSettings_api + '/GetFormSettingsByModule/' + CompanyId + '/' + ModuleId)
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    UpdateFormLevelPermissions(formPermissions:any){
        let body = JSON.stringify(formPermissions);
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');

        return this.http.post(this.FormSettings_api + '/UpdateFormPermissionsByFormId', body, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    UpdateApplicantStatusWithRecruiter(viewInfo: any) {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');

        return this.http.post(this.response_api + '/UpdateApplicantStatusWithRecruiter', viewInfo, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    GetBenchJobByPublishId(companyID, publishId): Observable<ApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.publicjob_api + '/GetJobDetailsByPublishID/' + companyID + '/' + publishId, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    SaveApplicantFromJobPosting(applicantInfo: any) {
        let body = JSON.stringify(applicantInfo);
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.post(this.publicjob_api + '/AddNewApplicantFromJobPosting', body, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    downloadCandidateAttachment(filedetails:any): Observable<Blob> {
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

    GetApplicantsActivityLog(applicantId,companyID): Observable<ApiResponse> {
        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", 'application/json');
        return this.http.get(this.response_api + '/GetJobResponsesActivity/' + applicantId  + '/' + companyID, { headers: headers })
            .pipe(map(response => <ApiResponse>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }

    GetApplicantsByReports(ReportFilters:any): Observable<ApiResponse> {
        let headers = new HttpHeaders();
        headers =  headers.append("Content-Type", 'application/json');
        return this.http.post(this.response_api + '/FetchApplicantsByReport', ReportFilters, { headers: headers })
             .pipe(map(response => <ApiResponse>response)
            ,catchError((error: Response) => {
                let errorText = this._errorService.getErrorMessage(error);
                return observableThrowError(errorText);
            }));
      }
    
   

}
