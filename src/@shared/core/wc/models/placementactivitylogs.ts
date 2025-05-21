export class PlacementActivityLog{
    PlacementLogID:number;
    PlacementID:number;
    Action:string;
    CreatedBy:string;
    CreatedDate:Date;

    constructor(){
        this.PlacementLogID=0;
        this.PlacementID=0;
        this.Action=null;
        this.CreatedBy=null;
        this.CreatedDate=new Date();
    }


}