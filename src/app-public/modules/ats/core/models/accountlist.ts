export class AccountList{
    AccountID:number;
    CompAccountId:number;
    CompanyAccountId:string;
    AccountName:string;
    AccountTypeId:number;
    AccountTypeName:string;
    OwnerId:string;
    FirstName:string;
    LastName:string;
    FormattedCreatedDate:string;
    CreatedDate:Date;
    CompanyId:number;
    Createdby:string;
    UpdatedBy:string;
    NotesCount:number;
}

export class MergedAccountItems{
    AccountTypeId:number;
    AccountTypeName:string;
    SelectedAccounts:AccountList[];
    MergedAccountName:string;
    CompanyId:number;
    Mergedby:string;
    OwnerId:string;
}