export class SignUp {
    FirstName: string;
    LastName: string;
    Email: string;
    PhoneNumber: string;
    Password: string;
    ConfirmPassword: string;
    Role: number;
    AgreeTAC: boolean;
    CompanyName:string;
    Website:string;
    PhoneExt:string;
    EmployerType:number;
    PhoneCountryCode:string;
    constructor(){
        this.FirstName=null;
        this.LastName=null;
        this.Email=null;
        this.PhoneNumber=null;
        this.Password=null;
        this.ConfirmPassword=null;
        this.Role=0;
        this.AgreeTAC=false;
        this.CompanyName=null;
        this.Website=null;
        this.PhoneExt=null;
        this.EmployerType=null;
        this.PhoneCountryCode=null;
    }
    
}