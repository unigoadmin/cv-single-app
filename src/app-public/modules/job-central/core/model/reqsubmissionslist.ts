export class RequisitionSubmissionList{
    SubmissionId:number;
    ResponseId:number;
    FirstName:string;
    LastName:string;
    SubmissionStatus:number;
    SubmittedDate:Date;
    BillRate:number;
    SubmittedBy:number;
    SubittedByName:string;
    bgclass:string;
    SubmissionStatusName:string;
    constructor(){
        this.SubmissionId=0;
        this.ResponseId=0;
        this.FirstName=null;
        this.LastName=null;
        this.SubmissionStatus=0;
        this.SubmittedDate=new Date();
        this.BillRate=0;
        this.SubmittedBy=null;
        this.SubittedByName=null;
        this.bgclass=null;
        this.SubmissionStatusName=null;
    }
}