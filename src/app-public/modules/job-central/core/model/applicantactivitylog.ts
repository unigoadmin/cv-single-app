export class ActivityLogApplicant{
    LogId:number;
    ApplicantId:number;
    Action:string;
    CreatedBy:string;
    CreatedByName:string;
    CreatedDate:Date;
    constructor(){
        this.LogId = 0;
        this.ApplicantId=0;
        this.Action = null;
        this.CreatedBy = null;
        this.CreatedByName = null;
        this.CreatedDate = null;
    }
}