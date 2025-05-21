import { updateLocale } from 'moment';
import { AccountContact } from './accountcontact'
export class JobAccount
    {
         AccountID:number;
         CompAccountID:number;
         AccountName :string;
         AccountTypeID :number;
         AccountTypeName :string;
         CreatedBy :string;
         CreatedDate :Date;
         UpdatedBy :string;
         Employer :boolean
         UpdatedDate? :Date;
         CompanyID:number;
         AccountLevel :string;
         MappingStatus:boolean
         AccountContacts :AccountContact;
         constructor(){
            this.AccountID=0;
            this.CompAccountID=0;
            this.AccountName =null;
            this.AccountTypeID=0;
            this.AccountTypeName =null;
            this.CreatedBy=null;
            this.CreatedDate =new Date();
            this.UpdatedBy =null;
            this.Employer =false
            this.UpdatedDate=null;
            this.CompanyID=0;
            this.AccountLevel =null;
            this.MappingStatus=false
            this.AccountContacts =new AccountContact();
         }

    }