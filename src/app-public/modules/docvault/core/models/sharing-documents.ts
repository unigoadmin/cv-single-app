import {DocShareTo} from '../models/docshareto';
export class SharingDocuments{
    DocumentId:number;
    SharedBy:string;
    SharedUserType:number;
    Status:boolean;
    SharedTo:DocShareTo[];
    SharedDate:Date;
    ShareType:number;
    Recepients:string[];
    CompanyId:number;
}