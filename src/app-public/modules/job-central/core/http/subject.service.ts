import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({providedIn:'root'})
export class SubjectService{
    public candRefresh=new Subject<any>();
}