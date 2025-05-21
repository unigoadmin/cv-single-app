export class ApplicationStatus {
    StatusId: number;
    StatusName: string;
    IsActive: boolean;
    CreatedBy: string;
    CreatedDate: Date;
    UpdatedBy: string;
    UpdatedDate: Date;
    CompanyId: number;
    DBStatus: string;
    ColorCode: string;
    bgclass: string;
    bgdisplay:string;
    IsDefault:boolean;
    constructor() {
        this.StatusId = 0;
        this.StatusName = null;
        this.IsActive = false;
        this.CreatedBy = null;
        this.CreatedDate = new Date;
        this.UpdatedBy = null;
        this.UpdatedDate = new Date;
        this.CompanyId = 0;
        this.DBStatus = null;
        this.ColorCode = null;
        this.bgclass = null;
        this.bgdisplay =null;
        this.IsDefault=false;
    }
}