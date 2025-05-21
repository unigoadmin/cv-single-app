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