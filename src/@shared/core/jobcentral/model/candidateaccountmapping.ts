export class CandidateAccountMapping{
    CandidateMappingId:number;
    CandidateId:number;
    AccountID:number;
    Employer:boolean;
    MappingStatus:boolean;
    CreatedDate:Date;
    UpdatedDate:Date;
    SalesPOC:CandidateAcctContactInfo;
    constructor(){
        this.CandidateMappingId=0;
        this.CandidateId=0;
        this.AccountID=0;
        this.Employer=false;
        this.MappingStatus=false;
        this.CreatedDate=new Date();
        this.UpdatedDate=null;
        this.SalesPOC=new CandidateAcctContactInfo();
    }

}

export class CandidateAcctContactInfo {
    CandidateContactID: number;
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
        this.CandidateContactID=0;
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