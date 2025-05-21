import { Injectable } from '@angular/core';
import { APIService } from 'src/@shared/services/api.service';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ErrorService } from 'src/@shared/services';
import { catchError, map } from 'rxjs/operators';
import { throwError as observableThrowError, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NotesService{

    response_api = environment.APIServerUrl + 'JobBoardResponses';
    Filestore_api = environment.APIServerUrl + 'FileStore';
    candidates_api = environment.APIServerUrl + 'Candidates';

    constructor(private apiservice:APIService,
                private http: HttpClient,
                private _errorService: ErrorService,
    ){

    }

    GetResponsesNotes(filternotes: any) :Observable<any>{
        const url = this.response_api + '/GetJobBoardResponseNotes'
        return this.apiservice.post(url,filternotes);
    }

    GetCandidateNotes(filternotes: any) :Observable<any>{
        const url = this.candidates_api + '/GetCandidateMasterNotes'
        return this.apiservice.post(url,filternotes);
    }

    SaveResponseNotes(responseNotes: any):Observable<any>{
        const url = this.response_api + '/SaveResponseNotes'
        return this.apiservice.post(url,responseNotes);
    }

    SaveCandidateNotes(responseNotes: any):Observable<any>{
        const url = this.candidates_api + '/AddCandidateMasterNotes'
        return this.apiservice.post(url,responseNotes);
    }

    DeleteCandidateNotes(responseNotes: any):Observable<any>{
        const url = this.candidates_api + '/DeleteCandidateMasterNotes'
        return this.apiservice.post(url,responseNotes);
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

    uploadNotesAttachements(file: File[], companyId: number): Observable<any> {
        let formData: FormData = new FormData();
        formData.append("file", file[0]);

        return this.http.post(this.Filestore_api + '/CandidateNotesAttachement/' + companyId, formData)
            .pipe(map(response => <any>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }


}