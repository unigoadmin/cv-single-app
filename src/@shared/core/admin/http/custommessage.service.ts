import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { BaseService } from 'src/@shared/services/base.service';
import { environment } from 'src/environments/environment';
import { throwError as observableThrowError,Observable } from 'rxjs';
import { ErrorService } from 'src/@shared/services';
import { ApiResponse } from '../models/apiresponse';
import { CustomMessageFields } from '../models/custommessages';

@Injectable({
    providedIn: 'root'
  })

  export class CustomMessageService extends BaseService {
  
    baseURI= environment.APIServerUrl+'CustomMessage';
    constructor(private http: HttpClient,
      private _errorService: ErrorService) {    
      super();      
    }

    GetCompanyCustomMessages(companyId:number,categoryId:number,ModuleId:string){
        return this.http.get(this.baseURI + '/GetCustomMessagesList/'+companyId+'/'+categoryId+'/'+ModuleId)
            .pipe(map(response => <ApiResponse>response)
            ,catchError((error: Response) => {
                let errorText = this._errorService.getErrorMessage(error);
                return observableThrowError(errorText);
        }));
    }

    UpdateCustomMessage(customMessage:CustomMessageFields){
      let headers = new HttpHeaders();
            headers =  headers.append("Content-Type", 'application/json');
            return this.http.post(this.baseURI + '/UpdateCustomMessage', customMessage, { headers: headers })
                 .pipe(map(response => <ApiResponse>response)
                ,catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }
}