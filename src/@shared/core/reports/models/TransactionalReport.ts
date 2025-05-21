import { ReportSelectedDisplayColumns } from "./reportparametersmetadata";

export class TransactionalReport {
    ReportId: number;
    CategoryId: number;
    ReportTypeId: number;
    ReportName: string;
    IsDefault: boolean;
    CompanyId: number;
    CreatedBy: string;
    CreatedDate: Date;
    UpdatedBy: string;
    UpdatedDate?: Date;
    ReportTypeName:string;
    CreatedByName:string;
    ReportParameterValues:ReportParameterValues[];
    ReportSelectedDisplayColumns:ReportSelectedDisplayColumns[];
    TaskId:number;
    constructor() {
        this.ReportId = 0;
        this.CategoryId = 0;
        this.ReportTypeId = 0;
        this.ReportName = null;
        this.IsDefault = false;
        this.CompanyId = 0;
        this.CreatedBy = null;
        this.CreatedDate = new Date();
        this.UpdatedBy = null;
        this.UpdatedDate = null;
        this.ReportParameterValues=[];
        this.ReportSelectedDisplayColumns=[];
        this.TaskId=0;
    }
}
export class ReportParameterValues {
    ReportParameterId: number;
    ReportParamMetaDataId: number;
    ReportId: number;
    ParameterName: string;
    ParameterValue: string;
    constructor() {
        this.ReportParameterId=0;
        this.ReportParamMetaDataId=0;
        this.ReportId=0;
        this.ParameterName=null;
        this.ParameterValue=null;
    }
}


export class RunReport{
    CategoryId :number;
    ReportTypeId :number;
    LogUserId :string;
    CompanyId :number;
    ReportParameterValues:ReportParameterValues[];
    constructor(){
        this.CategoryId =0;
        this.ReportTypeId =0;
        this.LogUserId =null;
        this.CompanyId =0;
        this.ReportParameterValues=[];
    }
}