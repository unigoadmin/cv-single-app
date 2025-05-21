import {map,catchError} from 'rxjs/operators'
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { FileUploadResponse } from '../models/fileuploadresponse'
import { ErrorService } from "../services/error.service";
import { AuthenticationService } from '../services/authentication.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class FileStoreService {
    private baseUrl: string;

    constructor(private http: HttpClient,
        private _errorService: ErrorService,
        private authService:AuthenticationService
        ) {
        this.baseUrl = environment.APIServerUrl + 'FileStore';
    }

    uploadCompanyLogo(file: File[]): Observable<FileUploadResponse> {
        let formData: FormData = new FormData();
        formData.append("file", file[0]);

        return this.http.post(this.baseUrl + '/UploadCompanyLogo', formData)
            .pipe(map(response => <FileUploadResponse>response)
            ,catchError((error: Response) => {
                let errorText = this._errorService.getErrorMessage(error);
                return observableThrowError(errorText);
            }));
    }

    uploadProfilePicture(file: File[]): Observable<FileUploadResponse> {
        let formData: FormData = new FormData();
        formData.append("file", file[0]);

        return this.http.post(this.baseUrl + '/UploadProfilePicture', formData)
            .pipe(map(response => <FileUploadResponse>response)
            ,catchError((error: Response) => {
                let errorText = this._errorService.getErrorMessage(error);
                return observableThrowError(errorText);
            }));
    }

    uploadResume(file: File[]): Observable<FileUploadResponse> {
        let formData: FormData = new FormData();
        formData.append("file", file[0]);
        
        return this.http.post(this.baseUrl + '/UploadResume', formData)
            .pipe(map(response => <FileUploadResponse>response)
            ,catchError((error: Response) => {
                let errorText = this._errorService.getErrorMessage(error);
                return observableThrowError(errorText);
            }));
    }
  
    
  
   





    
    
  
 
}



