export class RecurringJobs{
    Id:string;
    Name:string;
    Cron:string;
    NextExecution:Date;
    LastExecution:Date;
    TimeZoneId:string;
    LastJobState:string;
    HumanReadableCron:string;
    constructor(){
        this.Id=null;
        this.Name=null;
        this.Cron=null;
        this.NextExecution=null;
        this.LastExecution=null;
        this.TimeZoneId=null;
        this.LastJobState=null;
        this.HumanReadableCron=null;
    }

}