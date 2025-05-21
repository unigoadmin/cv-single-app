export class AccountMaster{
    AccountID:number;
    AccountName:string;
    AccountTypeID:number;
    AccountTypeName:string;
    CreatedBy:string;
    CreatedDate:Date;
    UpdatedBy:string;
    UpdatedDate:Date;
    CompanyID:number;
    AccountContacts:AccountContact[];

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
    }
}
export class AccountContact{
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