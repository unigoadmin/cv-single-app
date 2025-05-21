export class CustomMessageFields{
    CustomMessageId:number;
    CompanyId:number;
    ModuleId:string;
    Resource:string;
    Description:string;
    ResourceValue:string;
    CreatedDate:Date;
    CreatedBy:string;
    constructor(){
        this.CustomMessageId=0;
        this.CompanyId=0;
        this.ModuleId=null;
        this.Resource=null;
        this.Description=null;
        this.ResourceValue=null;
        this.CreatedDate=new Date();
        this.CreatedBy=null;
    }
}