export class RequistionExportModel{
    PostingId:string;
    JobTitle:string;
    FirstName:string;
    LastName:string;
    SubmissionStatusName:string;
    SubmittedDate:Date;
    SubmissionRate:number;
    SubmittedByName:string;
    PrimarySkills:string;
    Buyer:string;
    PostingOwner:string;
    Positions:number;
    Site:string;
    Status:number;
    StartDate:string;
    EndDate:string;
    Coordinator:string;
    CreatedDate:string;
    UpdatedDate:string;
    constructor(){
        this.PostingId=null;
        this.JobTitle=null;
        this.FirstName=null;
        this.LastName=null;
        this.SubmissionStatusName=null;
        this.SubmittedDate=new Date();
        this.SubmissionRate=0;
        this.SubmittedByName=null;
        this.PrimarySkills=null;
        this.Buyer=null;
        this.PostingOwner=null;
        this.Positions = 0;
        this.Site=null;
        this.Status=0;
        this.StartDate=null;
        this.EndDate=null;
        this.Coordinator=null;
        this.CreatedDate=null;
        this.UpdatedDate=null; 
    }
}


export class ReqSumbissions{
    SubmissionId:number;
    FirstName:string;
    LastName:string;
    SubmissionStatus:string;
    SubmittedByName:string;
    SubmittedDate:string;
    BillRate:number;
    constructor(){
        this.SubmissionId=0;
        this.FirstName=null
        this.LastName=null;
        this.SubmissionStatus=null;
        this.SubmittedByName=null;
        this.SubmittedDate=null;
        this.BillRate=0;

    }
}