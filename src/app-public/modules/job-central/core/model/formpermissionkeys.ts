export class FormPermissionKeys{
    FieldKey:string;
    FieldName:string;
    Attributes: Attribute[];
    constructor(){
        this.FieldKey=null;
        this.FieldName=null;
        this.Attributes=null;
    }
}

export class Attribute {
    Key: string;
    Value: string;
  }