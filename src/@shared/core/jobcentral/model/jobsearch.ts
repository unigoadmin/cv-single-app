export class JobSearch{
    CompanyId :number;
    EmployeeId:string;
    SearchByAssigned:string;
    SearchByText:string;
    SearchByUserId:string;
    SearchByHashTag:string;
    SearchByStatus?:number;
    PageIndex:number;
    PageSize:number;
    SearchByAccountName:string;
    constructor(){
    this.CompanyId =0;
    this.EmployeeId=null;
    this.SearchByAssigned=null;
    this.SearchByText=null;
    this.SearchByUserId=null;
    this.SearchByHashTag=null;
    this.SearchByStatus=null;
    this.PageIndex=0;
    this.PageSize=0;
    this.SearchByAccountName=null;
    }
}