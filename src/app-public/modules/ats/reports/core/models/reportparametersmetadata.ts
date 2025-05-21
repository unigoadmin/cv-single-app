import { TransactionalReport } from "./transactionalreport";

export class ReportParametersMetaData {
    Report: TransactionalReport;
    ReportFilters: ReportFilters[];
    ReportColumns: ReportColumns[];
    ReportSelectedColumns: ReportSelectedDisplayColumns[];
    constructor(){
    this.Report=new TransactionalReport();
    this.ReportFilters=[];
    this.ReportColumns=[];
    this.ReportSelectedColumns=[];
    }
}
export class ReportFilters {
    ReportParamMetaDataId: number;
    ReportTypeId: number;
    FieldName: string;
    FieldType: string;
    FieldLabel: string;
    FieldPlaceHolder: string;
    FieldIsRequired: string;
    FieldDataName: string;
    FieldSource: Source[];
    FieldSelectedValue: string;
    constructor() {
        this.ReportParamMetaDataId = 0;
        this.ReportTypeId = 0;
        this.FieldName = null;
        this.FieldType = null;
        this.FieldLabel = null;
        this.FieldPlaceHolder = null;
        this.FieldIsRequired = null;
        this.FieldDataName = null;
        this.FieldSource = [];
        this.FieldSelectedValue = null;
    }
}
export class Source {
    value: string;
    text: string;
    constructor() {
        this.value = null;
        this.text = null;
    }
}

export class ReportColumns {
    ReportColumnId: number;
    Label: string;
    Property: string;
    Type: string;
    Visible: boolean;
    cssClasses: string;
    DisplayOrder: number;
    constructor() {
        this.ReportColumnId = 0;
        this.Label = null;
        this.Property = null;
        this.Type = null;
        this.Visible = false;
        this.cssClasses = null;
        this.DisplayOrder = 0;
    }
}
export class ReportSelectedDisplayColumns {
    ReportSelectedColumnId: number;
    ReportTypeId: number;
    ReportId: number;
    Label: string;
    Property: string;
    Type: string;
    Visible: boolean;
    cssClasses: string;
    DisplayOrder: number;
    constructor() {
        this.ReportSelectedColumnId = 0;
        this.ReportTypeId = 0;
        this.ReportId = 0;
        this.Label = null;
        this.Property = null;
        this.Type = null;
        this.Visible = false;
        this.cssClasses = null;
        this.DisplayOrder = 0;
    }
}