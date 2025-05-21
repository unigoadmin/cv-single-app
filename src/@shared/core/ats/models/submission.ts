
export class Submissions {
    SubmissionID: number;
    CompSubmissionID: number;
    CandidateID: number;
    JobID: number;
    SubmittedRate?: number;
    SubmittedRateType?: number;
    Submittedby: string;
    SubmissionDate: Date;
    Status: number;
    UpdatedBy: string;
    UpdatedDate?: Date;
    SubmissionType: number;
    CompanyID: number;
    Job: Job;
    AvailabilityToStart:string;
    StatusName:string;
    IsConvertToConfirmation:boolean;
    AccountMasters: SubmissionAccount[];
    constructor() {
        this.SubmissionID = 0;
        this.CompSubmissionID = 0;
        this.CandidateID = 0;
        this.JobID = 0;
        this.SubmittedRate = null;
        this.SubmittedRateType = null;
        this.Submittedby = null;
        this.SubmissionDate = new Date();
        this.Status = 0;
        this.UpdatedBy = null;
        this.UpdatedDate = null;
        this.SubmissionType = 0;
        this.CompanyID = 0;
        this.Job = new Job();
        this.AccountMasters=[];
        this.StatusName=null;
        this.IsConvertToConfirmation = false;
        this.AvailabilityToStart=null;
    }
}
export class Job {
    JobID: number;
    CompJobID: number;
    Status: number;
    JobTitle: string;
    JobTypeID: number;
    JobCategory: number;
    WorkStatus: string;
    Address1: string;
    Address2: string;
    City: string;
    State: string;
    Country: string;
    ZipCode: string;
    Email: string;
    CompanyName: string;
    Education: string;
    PrimaryPhoneNumber: string;
    CreatedBy: string;
    CreatedDate: Date;
    UpdatedDate?: Date;
    UpdatedBy: string;
    CompanyID: number;
    JobDescription: string;
    CompanyJobId: string;
    DurationInYears:number;
    DurationInMonths:Number;
    Location:string;
    constructor() {
        this.JobID=0;
        this.CompJobID=0;
        this.Status=0;
        this.JobTitle=null;
        this.JobTypeID=0;
        this.JobCategory=null;
        this.WorkStatus=null;
        this.Address1=null;
        this.Address2=null;
        this.City=null;
        this.State=null;
        this.Country=null;
        this.ZipCode=null;
        this.Email=null;
        this.CompanyName=null;
        this.Education=null;
        this.PrimaryPhoneNumber=null;
        this.CreatedBy=null;
        this.CreatedDate=new Date();
        this.UpdatedDate=null;
        this.UpdatedBy=null;
        this.CompanyID=0;
        this.JobDescription=null;
        this.CompanyJobId=null;
        this.DurationInYears=0;
        this.DurationInMonths=0;
        this.Location=null;
    }
}
export class SubmissionAccount {
    AccountID: number;
    CompAccountID: number;
    AccountName: string;
    AccountTypeID: number;
    AccountTypeName: string;
    CreatedBy: string;
    CreatedDate: Date;
    UpdatedBy: string;
    Employer: boolean;
    UpdatedDate: Date;
    CompanyID: number;
    AccountLevel: string;
    MappingStatus: boolean;
    NewLayer: string;
    SubmissionAccountMappingID: number;
    AccountContacts: SubmissionAccountContact;
    constructor() {
        this.AccountID = 0;
        this.CompAccountID = 0;
        this.AccountName = null;
        this.AccountTypeID = 0;
        this.AccountTypeName = null;
        this.CreatedBy = null;
        this.CreatedDate = new Date();
        this.UpdatedBy = null;
        this.Employer = false;
        this.UpdatedDate = new Date();
        this.CompanyID = 0;
        this.AccountLevel = null;
        this.MappingStatus = null;
        this.NewLayer = null;
        this.SubmissionAccountMappingID = 0;
        this.AccountContacts = new SubmissionAccountContact();
    }
}
export class SubmissionAccountContact {
    ContactID: number;
    AccountID: number;
    FirstName: string;
    MiddleName: string;
    LastName: string;
    Email: string;
    Phonenumber: string;
    PhoneExt: string;
    CreatedBy: string;
    CreatedDate: Date;
    UpdatedBy: string;
    UpdatedDate?: Date;
    constructor() {
        this.ContactID = 0;
        this.AccountID = 0;
        this.FirstName = null;
        this.MiddleName = null;
        this.LastName = null;
        this.Email = null;
        this.Phonenumber = null;
        this.PhoneExt = null;
        this.CreatedBy = null;
        this.CreatedDate = new Date();
        this.UpdatedBy = null;
        this.UpdatedDate = null;
    }
}
