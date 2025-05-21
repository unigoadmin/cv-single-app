export class ContactEnquiry{
     Name: string;
     LastName:string;
     EmailId: string;
     PhoneNo: string;
     Subject: string;
     Message: string;
     FromUserId: string;
     ToUserId:string[];
     ToUserName:string;
     FromUserName:string;
     constructor(){
          this.Name=null;
          this.LastName=null;
          this.EmailId=null;
          this.PhoneNo=null;
          this.Subject=null;
          this.Message=null;
          this.FromUserId=null;
          this.ToUserId=null;
          this.ToUserName=null;
          this.FromUserName=null;

     }
}