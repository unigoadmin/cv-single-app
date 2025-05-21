export class VerifyEmployee{
     EmployeeID:number;
     Email :string;
     PlacementID :number;
     CompanyID :number;
     CandidateID :number;
     CandidateEmail :string;
     IsCandidateMatched :boolean;
     IsEmployeeExists:boolean;
     IsUniqueUser :boolean;
     EmployeeType :string;
     constructor(){
        this.EmployeeID=0;
        this.Email =null;
        this.PlacementID =0;
        this.CompanyID =0;
        this.CandidateID =0;
        this.CandidateEmail =null;
        this.IsCandidateMatched =false;
        this.IsEmployeeExists=false;
        this.IsUniqueUser =false;
        this.EmployeeType =null;
     }
}