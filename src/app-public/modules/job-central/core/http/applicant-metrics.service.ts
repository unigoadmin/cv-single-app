import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIService } from 'src/@shared/services/api.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})

export class ApplicantMetricsService {
    metrics_api = environment.APIServerUrl + 'ApplicantMetrics';
    constructor(private apiservice: APIService) {

    }

    SearchJobs(filters: any): Observable<any> {
        const url = this.metrics_api + '/SearchJobs'
        return this.apiservice.post(url, filters);
    }

    GetJobBasedMetrics(filters: any): Observable<any>{
        const url = this.metrics_api + '/JobBasedMetrics'
        return this.apiservice.post(url, filters);
    }

    GetApplicantUserMetrics(filters: any): Observable<any>{
        const url = this.metrics_api + '/UserApplicantMetrics'
        return this.apiservice.post(url, filters);
    }
}