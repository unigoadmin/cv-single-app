export class HashTag {
    HashTagId:number;    
    HashTagText:string; 
    HashTagSource:string;
    CreatedBy:string;    
    CreatedDate:Date; 
    UpdatedDate:Date;
    Status:string;
    ModuleType :string;
    Category:number;
    state:boolean;
    constructor(){
        this.HashTagId=0;
        this.HashTagText=null;
        this.HashTagSource=null;
        this.CreatedBy=null;
        this.CreatedDate=new Date();
        this.UpdatedDate=new Date();
        this.Status=null;
        this.ModuleType=null;
        this.Category=0;
        this.state=null;
    }
}