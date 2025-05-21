export class ActivityLogCandidate{
    CandidateLogId:number;
    CandidateId:number;
    Action:string;
    CreatedBy:string;
    CreatedByName:string;
    CreatedDate:Date;
    constructor(){
        this.CandidateLogId = 0;
        this.CandidateId=0;
        this.Action = null;
        this.CreatedBy = null;
        this.CreatedByName = null;
        this.CreatedDate = null;
    }
}