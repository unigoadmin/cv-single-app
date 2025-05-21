export class AssignmentEmployee {
    EmployeeID: number;
    FirstName: string;
    MiddleName: string;
    LastName: string;
    Email: string;
    CompanyEmployeeID: string;
    HRManager: string;
    FinanceManager: string;
    TrainingManager: string;
    constructor() {
        this.EmployeeID = 0;
        this.FirstName = null;
        this.MiddleName = null;
        this.LastName = null;
        this.Email = null;
        this.CompanyEmployeeID = null;
        this.HRManager = null;
        this.FinanceManager = null;
        this.TrainingManager = null;
    }
}