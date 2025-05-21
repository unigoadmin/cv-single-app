export class JobsHotList{
    HotListId:number;
    HotListName:string;
    Description:string;
    HashTags:string;
    Status:number;
    CreatedBy:string;
    CreatedDate:Date;
    UpdatedBy:string;
    UpdatedDate:Date;
    CompanyId:number;
    constructor(){
        this.HotListId=0;
        this.HotListName=null;
        this.Description=null;
        this.HashTags=null;
        this.Status=0;
        this.CreatedBy=null;
        this.CreatedDate=new Date();
        this.UpdatedBy=null;
        this.UpdatedDate=new Date();
        this.CompanyId=0;
    }

}