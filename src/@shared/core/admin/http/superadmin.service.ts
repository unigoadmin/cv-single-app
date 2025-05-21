import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { BaseService } from 'src/@shared/services/base.service';
import { environment } from 'src/environments/environment';
import { throwError as observableThrowError,Observable } from 'rxjs';
import { ErrorService } from 'src/@shared/services';
import { ApiResponse } from '../models/apiresponse';


@Injectable({
    providedIn: 'root'
  })

  export class SuperAdminService extends BaseService {

    baseURI= environment.APIServerUrl+'SuperAdmin';
    taskURI = environment.TASKAPIURL+'Hangfire';
    constructor(private http: HttpClient,
      private _errorService: ErrorService) {    
      super();      
    }

    getOnboardingCompaines(): Observable<any> {
        return this.http.get(this.baseURI + '/GetOnboardingCompanies')
            .pipe(map(response => <any>response)
            ,catchError((error: Response) => {
                let errorText = this._errorService.getErrorMessage(error);
                return observableThrowError(errorText);
        }));
      }

      getCompanyDetails(companyId:number):Observable<any>{
        return this.http.get(this.baseURI + '/GetCompanyById/'+companyId)
            .pipe(map(response => <any>response)
            ,catchError((error: Response) => {
                let errorText = this._errorService.getErrorMessage(error);
                return observableThrowError(errorText);
        }));
      }

      getCompanyModules(companyId:number):Observable<any>{
        return this.http.get(this.baseURI + '/GetCompanyModules/'+companyId)
            .pipe(map(response => <any>response)
            ,catchError((error: Response) => {
                let errorText = this._errorService.getErrorMessage(error);
                return observableThrowError(errorText);
        }));
      }

      getRecurringJobs():Observable<any>{
        return this.http.get(this.taskURI + '/recurring-jobs')
            .pipe(map(response => <any>response)
            ,catchError((error: Response) => {
                let errorText = this._errorService.getErrorMessage(error);
                return observableThrowError(errorText);
        }));
      }

      updateCompanyModules(companyModules:any[],companyId:number) {
        let headers = new HttpHeaders();
        headers =  headers.append("Content-Type", 'application/json');
          return this.http.post(this.baseURI + '/UpdateModulesBySuperAdmin/'+companyId, companyModules, { headers: headers })
              .pipe(map(response => console.log(response))
              ,catchError((error: Response) => {
                  let errorText = this._errorService.getErrorMessage(error);
                  return observableThrowError(errorText);
          }));
      }

      updateCompanyStatus(companyInfo:any) {
        let headers = new HttpHeaders();
        headers =  headers.append("Content-Type", 'application/json');
          return this.http.post(this.baseURI + '/UpdateCompanyStatus',companyInfo, { headers: headers })
             .pipe(map(response => <ApiResponse>response)
              ,catchError((error: Response) => {
                  let errorText = this._errorService.getErrorMessage(error);
                  return observableThrowError(errorText);
          }));
      }
  } 