export class BenchCandidateSearch {
    CompanyId: number;
    EmployeeId: string;
    SearchByText: string;
    SearchByAssigned: string;
    SearchByStatus: number;
    SearchByUserId: string;
    SearchByHashTag: string;
    SearchByAccountId: number;
    SearchByWorkStatus: string;
    SearchByTodayScheduledIds: number[];
    SearchByUpcomingScheduledIds: number[];
    PageIndex: number;
    PageSize: number;
    Module:number;
    constructor() {
        this.CompanyId = 0;
        this.EmployeeId = null;
        this.SearchByText = null;
        this.SearchByAssigned = null;
        this.SearchByStatus = 0;
        this.SearchByUserId = null;
        this.SearchByHashTag = null;
        this.SearchByAccountId = 0;
        this.SearchByWorkStatus = null;
        this.SearchByTodayScheduledIds = [];
        this.SearchByUpcomingScheduledIds = [];
        this.PageIndex = 0;
        this.PageSize = 0;
        this.Module=0;
    }
}