export class PlacementsList {
    PlacementID: number;
    ComapnyPlacementID: string;
    PlacementDate: Date;
    PlacementCategory: string;
    PlacementType: string;
    FirstName: string;
    LastName: string;
    WorkStatus: string;
    EndClient: string;
    StartDate: Date;
    EndDate?: Date;
    Status: number;
    StatusName: string;
    IsDelete: boolean;
    CreatedBy: string;
    JobTitle: string;
    Notes: string;
    BillRateEffective?: Date;
    constructor() {
        this.PlacementID= 0;
        this.ComapnyPlacementID=null;
        this.PlacementDate=new Date();
        this.PlacementCategory=null;
        this.PlacementType=null;
        this.FirstName=null;
        this.LastName=null;
        this.WorkStatus=null;
        this.EndClient=null;
        this.StartDate=new Date();
        this.EndDate= null;
        this.Status=0;
        this.StatusName=null;
        this.IsDelete=false;
        this.CreatedBy=null;
        this.JobTitle=null;
        this.Notes=null;
        this.BillRateEffective=null;
    }
}