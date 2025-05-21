import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompanySettingsResponse } from '../models/company-settings.model';
import { environment } from 'src/environments/environment';
import { APIService } from './api.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CompanySettingsService {
  constructor(private apiService: APIService) {}

  getSessionSettingValues(companyId: number): Observable<any> {
    const url = `${environment.APIServerUrl}company/GetIdleGetSessionConfig/${companyId}`;
    return this.apiService.get(url);
  }
}