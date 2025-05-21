export class WorkerCentralSummary{
    
    WorkPermitsExpiring:number;
    AssignmentsEnding:number;
    ActiveWorkers:number;
    W2Active:number;
    C2CActive:number;
    TotalPlacements:number;
    ActivePlacements:number;
    PendingReviewPlacements:number;
    ActiveAssignments:number;
    BillableAssignments:number;
    NonBillableAssignments:number;
    constructor(){
        this.WorkPermitsExpiring=0;
        this.AssignmentsEnding=0;
        this.ActiveWorkers=0;
        this.W2Active=0;
        this.C2CActive=0;
        this.TotalPlacements=0;
        this.ActivePlacements=0;
        this.PendingReviewPlacements=0;
        this.ActiveAssignments=0;
        this.BillableAssignments=0;
        this.NonBillableAssignments=0
    }
}