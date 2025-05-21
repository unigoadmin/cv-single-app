import {map,catchError} from 'rxjs/operators'
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { City } from '../models/city'
import { State } from '../models/state'
import { Keywords } from '../models/keywords'
import { ErrorService } from "../services/error.service";
import { environment } from "../../environments/environment";
import { EventEmitter } from '@angular/core';
import { ConsultviteTimeZones } from '../models/consultvite-timezones';
import {CountriesList} from '../models/countries-list';
import { InternalUsers } from '../models/internalusers';
import { ApiResponse } from '../models/apiresponse';

@Injectable({ providedIn: 'root' })
export class CommonService {
    private baseUrl: string;
    publicjob_api = environment.APIServerUrl + 'PublicJobs';
    Filestore_api = environment.APIServerUrl + 'FileStore';

    private static _emitters: { [channel: string]: EventEmitter<any> } = {};
    constructor(private http: HttpClient,
        private _errorService: ErrorService) {
        this.baseUrl =environment.APIServerUrl + 'Common';
    }

    getStates(): Observable<State[]> {
        return this.http.get(this.baseUrl + '/States')
            .pipe(map(response => <State[]>response)
            ,catchError((error: Response) => {
                let errorText = this._errorService.getErrorMessage(error);
                return observableThrowError(errorText);
            }));
    }

    getCities(): Observable<City[]> {
        return this.http.get(this.baseUrl + '/Cities')
            .pipe(map(response => <City[]>response)
            ,catchError((error: Response) => {
                let errorText = this._errorService.getErrorMessage(error);
                return observableThrowError(errorText);
            }));
    }

    getCitiesByState(state: string): Observable<City[]> {
        return this.http.get(this.baseUrl + '/CitiesByState/' + state)
            .pipe(map(response => <City[]>response)
            ,catchError((error: Response) => {
                let errorText = this._errorService.getErrorMessage(error);
                return observableThrowError(errorText);
            }));
    }

    getKeywords(CompanyId:number): Observable<Keywords[]> {
        return this.http.get(this.baseUrl + '/Keywords/'+ CompanyId)
            .pipe(map(response => <Keywords[]>response)
            ,catchError((error: Response) => {
                let errorText = this._errorService.getErrorMessage(error);
                return observableThrowError(errorText);
            }));
    }
    
    GetAllTimeZones(): Observable<ConsultviteTimeZones[]> {
        return this.http.get(this.baseUrl + '/AllTimeZones')
            .pipe(map(response => <ConsultviteTimeZones[]>response)
            ,catchError((error: Response) => {
                let errorText = this._errorService.getErrorMessage(error);
                return observableThrowError(errorText);
            }));
    }
   
    GetCountries():Observable<CountriesList[]>{
        return this.http.get(this.baseUrl + '/Countries')
            .pipe(map(response => <CountriesList[]>response)
            ,catchError((error: Response) => {
                let errorText = this._errorService.getErrorMessage(error);
                return observableThrowError(errorText);
            }));
    }

    getCRMHashTag(companyId: number, ModuleName: string, Category: number = 0): Observable<any[]> {
        return this.http.get(this.baseUrl + '/GetHashTag/' + companyId + '/' + ModuleName + '/' + Category )
        .pipe(map(response => <any[]>response)
        ,catchError((error: Response) => {
            let errorText = this._errorService.getErrorMessage(error);
            return observableThrowError(errorText);
        }));
      }

      getInternalUsersByModuleId(companyId: number,ModuleId:string): Observable<InternalUsers[]> {
        return this.http.get(this.baseUrl + '/GetInternalUsers/' + companyId + '/'+ ModuleId)
            .pipe(map(response => <InternalUsers[]>response)
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

  
}



