import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIService } from 'src/@shared/services/api.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class JobsHotListService{
    hotlistjob_api = environment.APIServerUrl + 'JobsHotList';

    constructor(private apiservice:APIService){

    }

    SaveJobsHotList(hotListInfo: any): Observable<any> {
        const url = this.hotlistjob_api + '/SaveJobsHotList'
        return this.apiservice.post(url, hotListInfo);
    }

    GetJobsHotList(companyId:number,userId:string): Observable<any> {
        const url = this.hotlistjob_api + '/GetJobsHotList' + '/' +companyId +'/'+userId
        return this.apiservice.get(url);
    }

    GetMappingJobsHotList(hotListInfo: any): Observable<any> {
        const url = this.hotlistjob_api + '/GetActiveJobsWithHotListMapping'
        return this.apiservice.post(url,hotListInfo);
    }

    MapJob_HotList(mappingInfo:any):Observable<any>{
        const url = this.hotlistjob_api + '/MapHotListToJob'
        return this.apiservice.post(url, mappingInfo);
    }

    ShareHotList(hotListInfo: any) :Observable<any>{
        const url = this.hotlistjob_api + '/ShareHotList'
        return this.apiservice.post(url,hotListInfo);
    }

    FetchHtmlContent(hotListInfo: any):Observable<any>{
        const url = this.hotlistjob_api + '/FetchHotListContent'
        return this.apiservice.post(url,hotListInfo);
    }

    GetHotListActivityLogs(HotListId:number,companyId:number): Observable<any>{
        const url = this.hotlistjob_api + '/GetJobsHotListActivity' + '/' +HotListId +'/'+companyId
        return this.apiservice.get(url);
    }




}