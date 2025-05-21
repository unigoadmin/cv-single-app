export class InterviewReport{
    Id:number;
    POCName:string;
    Consultant:string;
    EndClient:string;
    Vendor:string;
    Status:number;
    InterviewStatus:string;
    InterviewDate:Date;
    constructor(){
        this.Id=0;
        this.POCName=null;
        this.Consultant=null;
        this.EndClient=null;
        this.Vendor=null;
        this.Status=0;
        this.InterviewStatus=null;
        this.InterviewDate=new Date;
    }
}