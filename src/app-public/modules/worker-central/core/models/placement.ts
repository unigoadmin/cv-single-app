export class Placement{
    PlacementID:number;
    ComapnyPlacementID:string;
    CompPlacementID:number;
    Status:number;
    PlacementType:string;
    StartDate:Date;
    EndDate?:Date;
    BillRate:string;
    BillRateType:number;
    PlacementPOC:string;
    CompanyID:number;
    EmployeeID:string;
    CreatedBy:string;
    CreatedDate:Date;
    UpdatedBy:string;
    UpdatedDate:Date;
    Job:PlacementJob;
    Candidate:PlacementCandidate;
    //AccountMasters:PlacementAccount[];
    PlacementAccountMappings:PlacementAccountMappings[];
    JobCategory:number;
    BillRateEffectiveDate?:Date;
    IsPlacement:boolean;
    IsConvertToPlacement:boolean;
    constructor(){
        this.PlacementID=0;
        this.ComapnyPlacementID=null;
        this.Status=0;
        this.PlacementType=null;
        this.StartDate=new Date();
        this.EndDate=null;
        this.BillRate=null;
        this.BillRateType=0;
        this.PlacementPOC=null;
        this.CompanyID=0;
        this.EmployeeID=null;
        this.CreatedBy=null;
        this.CreatedDate=new Date();
        this.UpdatedBy=null;
        this.UpdatedDate=new Date();
        this.Job = new PlacementJob();
        this.Candidate = new PlacementCandidate();
        //this.AccountMasters =[];
        this.JobCategory=null;
        this.CompPlacementID=0;
        this.BillRateEffectiveDate=null;
        this.IsPlacement=false;
        this.PlacementAccountMappings=[];
        this.IsConvertToPlacement=false;
    }
}

export class PlacementJob{
    JobID:number;
    CompJobID:number;
    JobTitle:string;
    JobTypeID:number;
    JobDescription:string;
    JobCategory:number;
    WorkStatus:string;
    Address1:string;
    Address2:string;
    City:string;
    State:string;
    Country:string;
    ZipCode:string;
    Email:string;
    CompanyName:string;
    Education:string;
    PrimaryPhoneNumber:string;
    CreatedBy:string;
    CreatedDate:Date;
    UpdatedBy:string;
    UpdatedDate:Date;
    CompanyID:number;
    Status:number;
    CompanyJobId:string;
    DurationInMonths:number;
    Location:string;
    constructor(){
        this.JobID=0;
        this.JobTitle=null;
        this.JobTypeID=0;
        this.JobDescription=null;
        this.JobCategory =null;
        this.WorkStatus=null;
        this.Address1=null;
        this.Address2=null;
        this.City=null;
        this.Status=0;
        this.Country=null;
        this.ZipCode=null;
        this.Email=null;
        this.CompanyName=null;
        this.Education=null;
        this.PrimaryPhoneNumber=null;
        this.CreatedBy=null;
        this.CreatedDate=new Date();
        this.UpdatedBy=null;
        this.UpdatedDate=new Date();
        this.CompanyID=0;
        this.CompJobID=0;
        this.DurationInMonths=0;
this.Location=null;
    }
}

export class PlacementCandidate{
    CandidateID:number;
    CompanyCandidateId:string;
    Status:number;
    FirstName:string;
    MiddleName:string;
    LastName:string;
    Email:string;
    PrimaryPhoneNumber:string;
    Address1:string;
    Address2:string;
    City:string;
    State:string;
    Country:string;
    ZipCode:string;
    WorkStatus:string;
    WorkStatusExpiry:Date;
    Title:string;
    PayRate:string;
    PayRateType:number;
    CreatedBy:string;
    CreatedDate:Date;
    UpdatedBy:string;
    UpdatedDate:Date;
    CompanyID:number;
    EmploymentType:string;
    ExperienceYears:string;
    CompCandID:number;
    EmployeeID:number;
    constructor(){
        this.CandidateID=0;
        this.CompanyCandidateId=null;
        this.Status=0;
        this.FirstName=null;
        this.MiddleName=null;
        this.LastName=null;
        this.Email=null;
        this.PrimaryPhoneNumber=null;
        this.Address1=null;
        this.Address2=null;
        this.City=null;
        this.Status=0;
        this.Country=null;
        this.ZipCode=null;
        this.WorkStatus=null;
        this.Title=null;
        this.PayRate=null;
        this.PayRateType=0;
        this.CreatedBy=null;
        this.CreatedDate=new Date();
        this.UpdatedBy=null;
        this.UpdatedDate=new Date();
        this.CompanyID=0;
        this.EmploymentType=null;
        this.ExperienceYears=null;
        this.EmployeeID = 0;

    }
}

export class PlacementAccount{
    AccountID:number;
    AccountName:string;
    AccountTypeID:number;
    AccountTypeName:string;
    CreatedBy:string;
    CreatedDate:Date;
    UpdatedBy:string;
    UpdatedDate:Date;
    CompanyID:number;
    AccountLevel:string;
    Employer:boolean
    AccountContacts:PlacementAccountContact[];
    MappingStatus:boolean;
    NewLayer:string;
    constructor(){
        this.AccountID=0;
        this.AccountName=null;
        this.AccountTypeID=0;
        this.AccountTypeName=null;
        this.CreatedBy=null;
        this.CreatedDate=new Date();
        this.UpdatedBy=null;
        this.UpdatedDate=new Date();
        this.CompanyID=0;
        this.AccountContacts=[];
        this.AccountLevel=null;
        this.Employer=false
        this.MappingStatus=true;
        this.NewLayer=null;
    }

}

export class PlacementAccountContact{
    ContactID:number;
    AccountID:number;
    FirstName:string;
    MiddleName:string;
    LastName:string;
    Email:string;
    Phonenumber:string;
    CreatedBy:string;
    CreatedDate:Date;
    UpdatedBy:string;
    UpdatedDate:Date;

    constructor(){
        this.ContactID=0;
        this.AccountID=0;
        this.FirstName=null;
        this.LastName=null;
        this.MiddleName=null;
        this.Email=null;
        this.Phonenumber=null;
        this.CreatedBy=null;
        this.CreatedDate=new Date();
        this.UpdatedBy=null;
        this.UpdatedDate=new Date();
    }
}
export class PlacementAccountMappings {
    PlacementAccountMappingID: number;
    PlacementID: number;
    AccountID: number;
    MappingStatus: boolean
    CreatedDate: Date;
    UpdatedDate: Date;
    AccountLevel: string;
    AccountTypeId: number
    AccountName: string;
    Employer: boolean;
    BillRate:string;
    BillRateType:number;
    Isbilling:boolean;
    BillingAccountDisable:boolean;
    BillingPOC:PlacementAcctContactInfo;
    ImmigrationPOC:PlacementAcctContactInfo;
    SalesPOC:PlacementAcctContactInfo;
    PlacementAcctContactInfo:PlacementAcctContactInfo[];
    constructor() {
        this.PlacementAccountMappingID=0;
        this.PlacementID=0;
        this.AccountID=0;
        this.MappingStatus=false;
        this.CreatedDate=new Date();
        this.UpdatedDate=new Date();
        this.AccountLevel=null;
        this.AccountTypeId=0;
        this.AccountName=null;
        this.Employer=false;
        this.BillRate=null;
        this.BillRateType=0;
        this.Isbilling=false;
        this.BillingAccountDisable=false;
        this.BillingPOC=new PlacementAcctContactInfo();
        this.ImmigrationPOC=new PlacementAcctContactInfo();
        this.SalesPOC=new PlacementAcctContactInfo();
        this.PlacementAcctContactInfo=[];
    }
}
export class PlacementAcctContactInfo {
    PlacementContactID: number;
    AccountID: number;
    FirstName: string;
    MiddleName: string;
    LastName: string;
    Email: string;
    Phonenumber: string;
    ContactType: number;
    CreatedBy: string;
    CreatedDate: Date;
    UpdatedBy: string;
    UpdatedDate?: Date;
    PlacementAccountMappingID: number;
    ContactID?: number;

    constructor() {
        this.PlacementContactID=0;
        this.AccountID=0;
        this.FirstName=null;
        this.MiddleName=null;
        this.LastName=null;
        this.Email=null;
        this.Phonenumber=null;
        this.ContactType=0;
        this.CreatedBy=null;
        this.CreatedDate=new Date();
        this.UpdatedBy=null;
        this.UpdatedDate =new Date();
        this.PlacementAccountMappingID=0;
        this.ContactID =0;
        
    }
}

export class PlacementFilters{
    placementId:number;
    PlacementStatus:number;
    companyId:number;
    updatedby:string;
    Notes:string;
}