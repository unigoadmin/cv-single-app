import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { BaseService } from 'src/@shared/services/base.service';
import { environment } from 'src/environments/environment';
import { throwError as observableThrowError,Observable } from 'rxjs';
import { ErrorService } from 'src/@shared/services';
import { Company } from '../models/company';


@Injectable({
  providedIn: 'root'
})

export class CompanyService extends BaseService {

  baseURI= environment.APIServerUrl+'company';
  constructor(private http: HttpClient,
    private _errorService: ErrorService) {    
    super();      
  }

  getCompanyById(companyId:number): Observable<Company> {
    return this.http.get(this.baseURI + '/companybyid/'+companyId)
        .pipe(map(response => <Company>response)
        ,catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
    }));
  }
  updateCompany(company:Company) {
    let headers = new HttpHeaders();
    headers =  headers.append("Content-Type", 'application/json');
      return this.http.post(this.baseURI + '/updatecompany',company, { headers: headers })
          .pipe(map(response => console.log(response))
          ,catchError((error: Response) => {
              let errorText = this._errorService.getErrorMessage(error);
              return observableThrowError(errorText);
      }));
  }   
}


