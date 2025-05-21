export class AccountContact {
    ContactID: number;
    AccountID: number;
    FirstName: string;
    MiddleName: string;
    LastName: string;
    Email: string;
    Phonenumber: string;
    PhoneExt: string;
    CreatedBy: string;
    CreatedDate: Date
    UpdatedBy: string;
    UpdatedDate?: Date
    constructor() {
        this.ContactID=0;
        this.AccountID=0;
        this.FirstName=null;
        this.MiddleName=null;
        this.LastName=null;
        this.Email=null;
        this.Phonenumber=null;
        this.PhoneExt=null;
        this.CreatedBy=null;
        this.CreatedDate=new Date()
        this.UpdatedBy=null;
        this.UpdatedDate=null
    }
}