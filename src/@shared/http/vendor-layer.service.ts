import {map,catchError} from 'rxjs/operators'
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { ErrorService } from "../services/error.service";
import { AuthenticationService } from '../services/authentication.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class VendorLayerService {
    private baseUrl: string;
    private talentCentral_api:string;

    constructor(private http: HttpClient,
        private _errorService: ErrorService,
        private authService:AuthenticationService
        ) {
        this.baseUrl = environment.APIServerUrl + 'FileStore';
        this.talentCentral_api = environment.APIServerUrl + 'TalentCentral';
    }

    GetAccounts(companyID: number): Observable<any[]> {
        return this.http.get(this.talentCentral_api + '/GetAllAccounts/' + companyID)
            .pipe(map(response => <any[]>response)
                , catchError((error: Response) => {
                    let errorText = this._errorService.getErrorMessage(error);
                    return observableThrowError(errorText);
                }));
    }
}