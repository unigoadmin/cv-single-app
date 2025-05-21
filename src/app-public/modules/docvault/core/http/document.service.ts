import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { BaseService } from 'src/@shared/services/base.service';
import { environment } from 'src/environments/environment';
import { throwError as observableThrowError,Observable } from 'rxjs';
import { ErrorService } from 'src/@shared/services';
import {  DocvaultFileUpload,  DocvaultUserDocuments,  DocvaultUserDocumentsSharingSnapshot,  SharedUsers, SharingDocuments } from '../models';


@Injectable({
  providedIn: 'root'
})

export class DocumentService extends BaseService {

  baseURI= environment.APIServerUrl+'document';
  fileURI= environment.APIServerUrl+'filestore';
  constructor(private http: HttpClient,
    private _errorService: ErrorService) {    
    super();      
  }

  DocvaultFileUpload(files: File[],companyId:number):Observable<DocvaultFileUpload[]>{
    const formData:any= new FormData();
    for(let i =0; i < files.length; i++){
      formData.append("files", files[i], files[i]['name']);
    }
    return this.http.post(this.fileURI + '/DocvaultFileUpload/'+companyId, formData)
        .pipe(map(response =><DocvaultFileUpload[]>response)
        ,catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));
  }
  DownloadDocvaultDocs(fileName: string, fileType: string,comanyId:number): Observable<Blob> {  

    let headers = new HttpHeaders();
    headers =  headers.append("Content-Type", 'application/json').append('responseType', 'arrayBuffer');
 
    return this.http.get(this.fileURI + '/DownloadDocVaultDocs/' + fileName + '/' + fileType+'/'+comanyId, { headers: headers,responseType:'blob' })
        .pipe(map(response => response)
        ,catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));
}
  GetTeamMembers(CompanyId:number,UserId:string): Observable<SharedUsers[]>{
    let headers = new HttpHeaders();
    headers =  headers.append("Content-Type", 'application/json');
  
    return this.http.get(this.baseURI + '/GetDocvaultUsers/'+CompanyId+'/'+UserId,  { headers: headers })
        .pipe(map(response => <SharedUsers[]> response)
        ,catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));
  }
  getMyDocuments(userId:string,companyId:number):Observable<DocvaultUserDocuments[]>{
    let headers = new HttpHeaders();
    headers =  headers.append("Content-Type", 'application/json');

    return this.http.get(this.baseURI+'/GetUserDocuments/'+userId+'/'+companyId, { headers: headers })
               .pipe(map(response =><DocvaultUserDocuments[]>response)
               ,catchError((error:Response) =>{
                 let errorText = this._errorService.getErrorMessage(error);
                 return observableThrowError(errorText);
               }));
   }
   saveDocuments(userDocuments:DocvaultUserDocuments[],userId:string):Observable<any>{
    let headers = new HttpHeaders();
    headers =  headers.append("Content-Type", 'application/json');

     return this.http.post(this.baseURI+'/SaveUserDocuments/'+userId,userDocuments,{ headers: headers })
                .pipe(map(response => <any>response)
                ,catchError((error:Response) => {
                  let errorText = this._errorService.getErrorMessage(error);
                  return observableThrowError(errorText);
                }));
   }
   updateDocument(userDocument:DocvaultUserDocuments){
    let headers = new HttpHeaders();
    headers =  headers.append("Content-Type", 'application/json');

     return this.http.post(this.baseURI+'/UpdateUserDocuments',userDocument,{ headers: headers })
                .pipe(map(response => <any>response)
                ,catchError((error:Response) => {
                  let errorText = this._errorService.getErrorMessage(error);
                  return observableThrowError(errorText);
                }));
   }
  
  ShareDocuments(shareddocs:SharingDocuments):Observable<any>{
     let headers = new HttpHeaders();
    headers =  headers.append("Content-Type", 'application/json');
  
    return this.http.post(this.baseURI + '/ShareDouments', shareddocs, { headers: headers })
         .pipe(map(response =><any> response)
        ,catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));
  }
  
  GetSharedDocumentDetails(DocumentId:number,UserId:string): Observable<DocvaultUserDocumentsSharingSnapshot[]>{;
    let headers = new HttpHeaders();
    headers =  headers.append("Content-Type", 'application/json');
  
    return this.http.get(this.baseURI + '/GetSharedDocuemtnDetails/'+DocumentId+'/'+UserId, { headers: headers })
        .pipe(map(response => <DocvaultUserDocumentsSharingSnapshot[]> response)
        ,catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));
  }
  
  GetSharedDetails(DocumentId:number): Observable<SharedUsers[]>{
    let headers = new HttpHeaders();
    headers =  headers.append("Content-Type", 'application/json');
  
    return this.http.get(this.baseURI + '/GetSharedDetails/'+DocumentId, { headers: headers })
        .pipe(map(response => <SharedUsers[]> response)
        ,catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));
  }

  GetTeamMembersForConultants(CompanyId:number,UserId:string): Observable<SharedUsers[]>{
    let headers = new HttpHeaders();
    headers =  headers.append("Content-Type", 'application/json');
    return this.http.get(this.baseURI + '/GetDocvaultUsersForConsultants/'+CompanyId+'/'+UserId,  { headers: headers })
        .pipe(map(response => <SharedUsers[]> response)
        ,catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));
  }
 
}


