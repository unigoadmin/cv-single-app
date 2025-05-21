export class WorkPermitModel{
    Id:string;
    WorkPermit:string;
    Description:string;
    Status:boolean;
    CreatedDate:Date;
    UpdatedDate:Date;
    CompanyId:number;
    constructor(){
        this.Id=null;
        this.WorkPermit=null;
        this.Description=null;
        this.Status=false;
        this.CreatedDate=new Date();
        this.UpdatedDate=new Date();
        this.CompanyId=0;
    }
}