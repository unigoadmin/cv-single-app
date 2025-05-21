export class ActivityLogSubmission{
    Id:number;
    SubmissionId:number;
    SubmissionsType:string;
    ScheduleId:number;
    ScheduleName:string;
    Comment:string;
    EventCreatorId:string;
    EventCreatorName:string
    EventCreatorType:string;
    CreatedDate:Date;
    constructor(){
        this.Id = 0;
        this.SubmissionId =null;
        this.SubmissionsType = null;
        this.ScheduleId = null;
        this.ScheduleName = null;
        this.Comment = null;
        this.EventCreatorId = null;
        this.EventCreatorName = null;
        this.EventCreatorType = null;
        this.CreatedDate = null;
    }
}