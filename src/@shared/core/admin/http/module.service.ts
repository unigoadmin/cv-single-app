import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { BaseService } from 'src/@shared/services/base.service';
import { environment } from 'src/environments/environment';
import { throwError as observableThrowError,Observable } from 'rxjs';
import { ErrorService } from 'src/@shared/services';
import { CompanyModules } from '../models';


@Injectable({
  providedIn: 'root'
})

export class ModuleService extends BaseService {

  baseURI= environment.APIServerUrl+'modules';
  constructor(private http: HttpClient,
    private _errorService: ErrorService) {    
    super();      
  }

  getCompanyModules(companyId:number): Observable<CompanyModules[]> {
    return this.http.get(this.baseURI + '/companymodules/'+companyId)
        .pipe(map(response => <CompanyModules[]>response)
        ,catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
    }));
  }

  updateCompanyModules(companyModules:CompanyModules[],companyId:number,userId:string) {
    let headers = new HttpHeaders();
    headers =  headers.append("Content-Type", 'application/json');
      return this.http.post(this.baseURI + '/updatecompanymodules/'+companyId+'/'+userId, companyModules, { headers: headers })
          .pipe(map(response => console.log(response))
          ,catchError((error: Response) => {
              let errorText = this._errorService.getErrorMessage(error);
              return observableThrowError(errorText);
      }));
  }   

  getCompanyActiveModules(companyId:number): Observable<CompanyModules[]> {
    return this.http.get(this.baseURI + '/companyactivemodules/'+companyId)
        .pipe(map(response => <CompanyModules[]>response)
        ,catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
    }));
  }
}


