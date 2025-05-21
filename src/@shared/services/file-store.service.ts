import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ErrorService } from 'src/@shared/services';
import { AuthenticationService } from 'src/@shared/services';

@Injectable()
export class FileStoreService{
    private baseUrl: string;
    Filestore_api = environment.APIServerUrl + 'FileStore';
    constructor(private http: HttpClient,
        private _errorService: ErrorService,
        private authService:AuthenticationService

        ) {
        this.baseUrl = environment.APIServerUrl + 'Placement';
    }
    getWebAPIUploadUrl(): string {
        let loginUser = this.authService.getLoginUser();
        return this.baseUrl + '/UploadPlacementDocuments/'+loginUser.Company.Id;
    }
    getWebAPIEmployeeUploadUrl(){
        let loginUser = this.authService.getLoginUser();
        return this.baseUrl + '/UploadEmployeeDocuments/'+loginUser.Company.Id;
    }
    uploadResume() {
        return this.Filestore_api + '/UploadResumeAndParsing'
    }
}