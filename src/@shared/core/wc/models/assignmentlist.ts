
export class AssignmentList {
    AssignmentID: number;
    CompAssignmentID: number;
    AssignmentName: string;
    Status: number;
    AssignmentType: string;
    AsmtCategory?: number;
    StartDate: Date;
    EndDate?: Date;
    BillingRate: string;
    BillRateType?: number;
    AsmtClassification: string;
    WLAddress1: string;
    WLAddress2: string;
    WLCity: string;
    WLState: string;
    WLCountry: string;
    WLZipCode: string;
    PlacementPOC: string;
    EmployeeID: number;
    IsDeleted: boolean;
    TimeSheet: boolean;
    CompanyID: number;
    CreatedBy: string;
    CreatedDate: Date;
    UpdatedBy: string;
    UpdatedDate?: Date;
    CompanyAssignmentId: string;
    EmployeeMaster: AssignmentEmployee;
    PlacementID: number;
    RemoteAssignment: boolean;
    AmendmentRequired: boolean;
    EndDateExpiryPriority: number;
    FirstName: string;
    MiddleName: string;
    LastName: string;
    StatusName:string;
    constructor() {
        this.AssignmentID = 0;
        this.CompAssignmentID = 0;
        this.AssignmentName = null;
        this.Status = 1;
        this.AssignmentType = null;
        this.AsmtCategory = 0;
        this.StartDate = new Date();
        this.EndDate = new Date();
        this.BillingRate = null;
        this.BillRateType = 0;
        this.AsmtClassification = null;
        this.WLAddress1 = null;
        this.WLAddress2 = null;
        this.WLCity = null;
        this.WLState = null;
        this.WLCountry = null;
        this.WLZipCode = null;
        this.PlacementPOC = null;
        this.EmployeeID = 0;
        this.IsDeleted = false;
        this.TimeSheet = false;
        this.CompanyID = 0;
        this.CreatedBy = null;
        this.CreatedDate = new Date();
        this.UpdatedBy = null;
        this.UpdatedDate = new Date();
        this.CompanyAssignmentId = null;
        this.EmployeeMaster = new AssignmentEmployee();
        this.PlacementID = 0;
        this.RemoteAssignment = false;
        this.AmendmentRequired = false;
        this.EndDateExpiryPriority = 0;
        this.FirstName = null;
        this.MiddleName = null;
        this.LastName = null;
        this.StatusName = null;
    }
}
export class AssignmentEmployee {
    EmployeeID: number;
    FirstName: string;
    MiddleName: string;
    LastName: string;
    Email: string;
    CompanyEmployeeID: string;
    constructor() {
        this.EmployeeID = 0;
        this.FirstName = null;
        this.MiddleName = null;
        this.LastName = null;
        this.Email = null;
        this.CompanyEmployeeID = null;
    }
}