export class ShareJobList{
    CompanyId:number;
    EmailRecepients:any;
    Subject:string;
    Notes:string;
    TableData:string;
    From:string;
    SharedByUserName:string;
    SharedBy:string;
    JobIds:any;
    HotListId:number;
    constructor(){
        this.CompanyId=0;
        this.EmailRecepients=[];
        this.Subject=null;
        this.Notes=null;
        this.TableData=null;
        this.From=null;
        this.SharedByUserName = null;
        this.SharedBy=null;
        this.JobIds=null;
        this.HotListId=0;
    }
}