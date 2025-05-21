export class SubActions{
    SubActionId:string;
    ActionId: string;
    ScreenId: string;
    ActionName:string;
    IsActive:boolean;
    IsDisabled:boolean;
    Description:string;
    ActionCode: string;
    ActionOrder?: number;
    constructor(){
        this.SubActionId = null,
        this.ActionId = null,
        this.ScreenId = null,
        this.ActionName = null,
        this.IsActive=null,
        this.IsDisabled = false,
        this.Description=null,
        this.ActionCode = null,
        this.ActionOrder = null
    }
}