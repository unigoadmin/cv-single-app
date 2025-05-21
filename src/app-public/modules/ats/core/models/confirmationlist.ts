export class ConfirmationList {
    ConfirmationID: number
    ComapnyConfirmationID: string;
    ConfirmationDate: Date;
    ConfirmationCategory: string;
    ConfirmationType: string;
    FirstName: string;
    LastName: string;
    WorkStatus: string;
    EndClient: string;
    StartDate: Date;
    EndDate?: Date;
    Status: number;
    IsDelete: boolean;
    CreatedBy: string;
    JobTitle: string;
    Notes: string;
    BillRateEffective?: Date;
    StatusName:String;
    IsConvertToPlacement:boolean;
    Statuslabels:string;
    constructor(){
        this.ConfirmationID=0;
        this.ComapnyConfirmationID=null;
        this.ConfirmationDate=new Date();
        this.ConfirmationCategory=null;
        this.ConfirmationType=null;
        this.FirstName=null;
        this.LastName=null;
        this.WorkStatus=null;
        this.EndClient=null;
        this.StartDate=new Date();
        this.EndDate=null;
        this.Status=null;
        this.IsDelete=false;
        this.CreatedBy=null;
        this.JobTitle=null;
        this.Notes=null;
        this.BillRateEffective=null;
        this.StatusName=null;
        this.IsConvertToPlacement = false;
    }
}