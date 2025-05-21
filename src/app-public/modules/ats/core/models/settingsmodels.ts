export class ResumeSource {
    SourceId: number;
    SourceName: string;
    CompanyId: number;
    CreatedBy: string;
    UpdatedBy: string;
    CreatedDate: Date;
    UpdatedDate: Date;
    Status: number;
    DBStatus: string;
    constructor() {
        this.SourceId = 0;
        this.SourceName = null;
        this.CompanyId = 0;
        this.CreatedBy = null;
        this.UpdatedBy = null;
        this.CreatedDate = new Date();
        this.UpdatedDate = new Date();
        this.Status = 0;
        this.DBStatus = null;
    }
}

export class HashTags {
    HashTagId: number;
    HashTagText: string;
    HashTagSource: string;
    CreatedBy: string;
    CreatedDate: Date;
    UpdatedDate: Date;
    Status: string;
    ModuleType: string;
    JobsCount: number;
    Category: number;
    CategoryName: string;
    constructor() {
        this.HashTagId = 0;
        this.HashTagText = null;
        this.HashTagSource = null;
        this.CreatedBy = null;
        this.CreatedDate = new Date();
        this.UpdatedDate = new Date();
        this.Status = null;
        this.ModuleType = null;
        this.JobsCount = 0;
        this.Category = 0;
        this.CategoryName = null;
    }
}
export class BenchAccountTypes {
    Id: number;
    AccountTypeName: string;
    IsActive: boolean;
    CreatedBy: string;
    CreatedDate: Date;
    UpdatedBy: string;
    UpdatedDate?: Date;
    CompanyId?: number;
    DBStatus: string;
    constructor() {
        this.Id = 0;
        this.AccountTypeName = null;
        this.IsActive = false;
        this.CreatedBy = null;
        this.CreatedDate = new Date();
        this.UpdatedBy = null;
        this.UpdatedDate = null;
        this.CompanyId = null;
        this.DBStatus = null;
    }
}
export class MasterSubmissionStatus {
    StatusId: number;
    StatusName: string;
    IsActive: number;
    CreatedBy: string;
    CreatedDate: Date;
    UpdatedBy: string;
    UpdatedDate: Date;
    CompanyId: number;
    DBStatus: string;
    ColorCode: string;
    bgclass: string;
    constructor() {
        this.StatusId = 0;
        this.StatusName = null;
        this.IsActive = 0;
        this.CreatedBy = null;
        this.CreatedDate = new Date;
        this.UpdatedBy = null;
        this.UpdatedDate = new Date;
        this.CompanyId = 0;
        this.DBStatus = null;
        this.ColorCode = null;
        this.bgclass = null;
    }
}
export class keywords {
    KeywordId: number;
    KeywordsText: string;
    KeywordsSource: string;
    CreateDate: Date;
    constructor() {
        this.KeywordId = 0;
        this.KeywordsText = null;
        this.KeywordsSource = null;
        this.CreateDate = new Date();
    }
}