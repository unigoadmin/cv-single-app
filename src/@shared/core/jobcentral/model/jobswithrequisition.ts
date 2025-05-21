export class JobsWithRequisitionStatus{
    JobID: number;
    CompJobID: number;
    Status: number;
    JobTitle: string;
    JobCategory:string;
    Location:string;
    Accounts:string;
    IsBenchJob:boolean;
    MappedApplicants:number;
    NotesCount:number;
    JobPostingDate:Date;
    JobSource:string;
    POC:string;
    IsJobMappedToReq:boolean;
    PublishedJobId:string;
    constructor(){
        this.JobID = 0;
        this.CompJobID = 0;
        this.Status = 0;
        this.JobTitle = null;
        this.JobCategory = null;
        this.Location=null;
        this.Accounts=null;
        this.IsBenchJob=false;
        this.MappedApplicants=0;
        this.NotesCount=0;
        this.JobPostingDate=null;
        this.JobSource=null;
        this.POC=null;
        this.IsJobMappedToReq=false;
        this.PublishedJobId=null;

    }
}