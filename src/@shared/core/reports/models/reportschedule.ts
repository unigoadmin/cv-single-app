export class ReportRecurrence{
    RecurrenceID:string;
    TaskID:number;
    ReportId:number;
    UpdatorID:string;
    UpdateDate:Date;
    IsActive:boolean;
    StartDate:Date;
    RangePattern:number;
    EndAfter:number;
    EndDate:Date;
    StDate:string;
    StTime:string;
    RecurrencePattern:number;
    HourlyRecurPattern:number;
    NoOfMinutesOrTimes:number;
    DailyRecurrencePattern:DailyRecurrencePattern;
    WeeklyRecurrencePattern:WeeklyRecurrencePattern;
    MonthlyRecurrencePattern:MonthlyRecurrencePattern;
    Emailrecepients:string[];
    constructor(){
        this.RecurrenceID=null;
        this.TaskID=0;
        this.ReportId=0;
        this.UpdatorID=null;
        this.UpdateDate=null;
        this.IsActive=false;
        this.StartDate=null;
        this.RangePattern=null;
        this.EndAfter=null;
        this.EndDate=null;
        this.StDate=null;
        this.StTime=null;
        this.RecurrencePattern=null;
        this.HourlyRecurPattern=null;
        this.NoOfMinutesOrTimes=null;
        this.DailyRecurrencePattern=null;
        this.WeeklyRecurrencePattern=null;
        this.MonthlyRecurrencePattern=null;
        this.Emailrecepients=null;
    }
}

export class DailyRecurrencePattern{
    DailyRecurrenceID:string;
    TaskID:number;
    OccurenceType:number;
    Occurence:number;
    constructor(){
        this.DailyRecurrenceID=null;
        this.TaskID=0;
        this.OccurenceType=0;
        this.Occurence=0;
    }
}

export class WeeklyRecurrencePattern{
    WeeklyRecurrenceID:string;
    TaskID:number;
    Occurence:number;
    WeekDays:number;
    constructor(){
        this.WeeklyRecurrenceID = null;
        this.TaskID=0;
        this.Occurence=0;
        this.WeekDays=0;
    }  
}

export class MonthlyRecurrencePattern{
    MonthlyRecurrenceID:string;
    TaskID:number;
    Occurence:number;
    Day:number;
    Week:number;
    OccurenceType:number;
    constructor(){
        this.MonthlyRecurrenceID=null;
        this.TaskID=0;
        this.Occurence=0;
        this.Day=0;
        this.Week=0;
        this.OccurenceType=0;
    }
}