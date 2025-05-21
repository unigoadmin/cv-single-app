import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { FormPermissions } from "../models/form-permissions";
import { environment } from 'src/environments/environment';


@Injectable()
export class FormPermissionsService {

    private $FormPermissionSubject = new Subject<FormPermissions[]>();
    $FormPermissions = this.$FormPermissionSubject.asObservable();
    constructor() { }

    setFormPermissions_JobCentral(formPermission: FormPermissions[]) {debugger;
        sessionStorage.setItem('jc_'+environment.FormPermissionsKeyName, JSON.stringify(formPermission))
        this.$FormPermissionSubject.next(formPermission);
        
    }

    getAllFormPermissions_JobCentral(): FormPermissions[] {
        let FormPermissions: FormPermissions[] = [];
        if (sessionStorage.getItem('jc_'+environment.FormPermissionsKeyName)) {
            FormPermissions = JSON.parse(sessionStorage.getItem('jc_'+environment.FormPermissionsKeyName));
        }
        return FormPermissions;
    }

    getFrmPermissions_JobCentral(FormCode: string, FieldCode: string) {debugger;
        let FieldAttributes: any = null;
        let FormItem: any = null;
        const PermissionsList = this.getAllFormPermissions_JobCentral();
      
        if (PermissionsList!= null && PermissionsList.length > 0) {
          FormItem = PermissionsList.find((item) => item.FormCode === FormCode);
      
          if (FormItem) {
            // Find the attributes of FieldCode
            var ParsedPermission = JSON.parse(FormItem.FormPermssions);
            const AttItem = ParsedPermission.find((item) => item.FieldKey === FieldCode);
      
            if (AttItem) {
              FieldAttributes = AttItem.Attributes;
            }
          }
        }
      
        // Handle cases where no data is found
        if (FieldAttributes === null) {
          // You can throw an error or return a default value here.
          // Example:
          // throw new Error('Field not found');
          // return 'Default Value';
        }
      
        return FieldAttributes;
      }
      


}