export class AccountMasterNotes{
    AccountNotesId: number;
    AccountId: number;
    Comment: string;
    CreatedBy: string;
    CreatedDate: Date;
    CreatedByName: string;
    ProfilePic: string;
    CompanyId: number;
    constructor(){
        this.AccountNotesId=0;
        this.AccountId=0;
        this.Comment=null;
        this.CreatedBy=null;
        this.CreatedDate=new Date();
        this.CreatedByName=null;
        this.ProfilePic=null;
        this.CompanyId=0;
    }
}