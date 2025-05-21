import { SubActions } from "./subactions";

export class Actions{
    ActionId: string;
    ScreenId: string;
    ActionName:string;
    IsActive:boolean;
    IsDisabled:boolean;
    Description:string;
    ActionCode: string;
    ActionOrder?: number;
    SubActions:SubActions[];
    constructor(){
        this.ActionId = null,
        this.ScreenId = null,
        this.ActionName = null,
        this.IsActive=null,
        this.IsDisabled = false,
        this.Description=null,
        this.ActionCode = null,
        this.ActionOrder = null,
        this.SubActions = []
    }
}


export class NewActions{
    ActionId: string;
    ScreenId: string;
    ActionName:string;
    IsActive:boolean;
    IsDisabled:boolean;
    Description:string;
    ActionCode: string;
    ActionOrder?: number;
    Children:SubActions[];
    constructor(){
        this.ActionId = null,
        this.ScreenId = null,
        this.ActionName = null,
        this.IsActive=null,
        this.IsDisabled = false,
        this.Description=null,
        this.ActionCode = null,
        this.ActionOrder = null,
        this.Children = []
    }
}