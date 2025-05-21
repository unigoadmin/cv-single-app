export class ApiResponse{
    ErrorMessage:string;
    SuccessMessage:string;
    Data:any;
    IsError:boolean;
    constructor(){
    this.ErrorMessage=null;
    this.SuccessMessage=null;
    this.Data=null;
    this.IsError=false;
    }
}


export class identity_response{
    errorMessage:string;
    successMessage:string;
    data:any;
    isError:boolean;
    constructor(){
    this.errorMessage=null;
    this.successMessage=null;
    this.data=null;
    this.isError=false;
    }
}

export class CompanySessionSettings{
    IdleTimeout:number;
    SessionTimeout:number;
    KeepAliveInterval:number;
    constructor(){
        this.IdleTimeout=0;
        this.SessionTimeout=0;
        this.KeepAliveInterval=0;
    }
}