export class AccountTypeList{
    AccountTypeID:number;
    AccountTypeName:string;
    CreatedDate:Date;
    constructor(){
     this.AccountTypeID =0;
     this.AccountTypeName=null;
     this.CreatedDate=new Date();
    }
}