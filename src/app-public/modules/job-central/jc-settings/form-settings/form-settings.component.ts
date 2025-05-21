import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { JobCentralService } from '../../core/http/job-central.service';
import { LoginUser } from 'src/@shared/models';
import { JcFormSettings } from '../../core/model/jcformsettings';
import { FormPermissionKeys } from '../../core/model/formpermissionkeys';
import { TableColumn } from 'src/@cv/interfaces/table-column.interface';
import { FormPermissionsService } from 'src/@shared/services/formpermissions.service';

@Component({
  selector: 'cv-jobcentral-form-settings',
  templateUrl: './form-settings.component.html',
  styleUrls: ['./form-settings.component.scss'],
  providers: [FormPermissionsService]
})
export class FormSettingsComponent implements OnInit {
  
  loginUser: LoginUser;
  jcFormSetting: JcFormSettings = new JcFormSettings();
  jcFormSettingList:JcFormSettings[] = [];
  FormkeysList:FormPermissionKeys[] = [];
  tableData:any = [];
  IsDataLaoaded:boolean=false;
  selectedFormId:string = "";
  IsFormChanged:boolean=false;
  constructor(private _alertService: AlertService,
    private _jobcentralService: JobCentralService,
    private _authService: AuthenticationService,
    private _formService:FormPermissionsService,
    private cdr:ChangeDetectorRef) {
      this.tableData=[];
     }

    
  tableColumns: TableColumn<FormPermissionKeys>[] = [
    { label: 'Field', property: 'FieldKey', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium',] },
    { label: 'FieldName', property: 'FieldName', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium',] },
    { label: 'Required', property: 'Required', type: 'badge', visible: false, cssClasses: ['text-secondary', 'font-medium',] },
    { label: 'Readonly', property: 'Readonly', type: 'badge', visible: true, cssClasses: ['text-secondary', 'font-medium',] }
  ];

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.getJobCentralFormSettings(this.loginUser.Company.Id);
    }
  }

  getJobCentralFormSettings(companyId:number){
    this._jobcentralService.GetJobCentralFormSettings(companyId,'D1605CE5-4500-44F4-8ED9-7D40A2F25594')
    .subscribe(
      jcSettingResponse => {
        if (jcSettingResponse.Data!=null) {
          this.jcFormSettingList = jcSettingResponse.Data;
          if(this.IsFormChanged){
            this._formService.setFormPermissions_JobCentral(jcSettingResponse.Data);
          }
        }
        if(!this.cdr["distroyed"]){
          this.cdr.detectChanges();
        }
      },
      error => {
        this._alertService.error(error);
        if(!this.cdr["distroyed"]){
          this.cdr.detectChanges();
        }
      }
    );
  }

  OnFormSelectionChanged(event){debugger;
    const i = this.jcFormSettingList.findIndex(x => x.FormId === event.value);
    if (i > -1) {
      this.selectedFormId = event.value;
      this.FormkeysList = JSON.parse(this.jcFormSettingList[i].FormPermssions);
      this.transformData();
      //this.tableData = this.FormkeysList;
      this.IsDataLaoaded=true;
    }
  }

  transformData() {
    this.tableData = [];
    this.FormkeysList.forEach((field) => {
      const rowData = {
        FieldKey: field.FieldKey,
        FieldName: field.FieldName
      };
      field.Attributes.forEach((attribute) => {
        rowData[attribute.Key] = attribute.Value;
      });
      this.tableData.push(rowData);
    });
    console.log(this.tableData);
  }

  updatePermissionsData(updatedItem: any): void {
    // Find the index of the item to be updated based on 'FieldKey'
    const index = this.tableData.findIndex((item) => item['FieldKey'] === updatedItem['FieldKey']);
  
    // Check if the item was found
    if (index !== -1) {
      // Replace the existing item with the updated item
      this.tableData[index] = updatedItem;
      const updatedModel = this.transformObjectToModel(updatedItem);
      const index_FormKeysList = this.FormkeysList.findIndex((item) => item['FieldKey'] === updatedItem['FieldKey']);
      if(index !==-1){
        this.FormkeysList[index_FormKeysList]=updatedModel;
        this.UpdateFormPermissions();
      }
    }
  }

  transformObjectToModel(inputObject: any): any {debugger;
    console.log(inputObject);
    const model = {
      FieldKey: inputObject.FieldKey,
      FieldName: inputObject.FieldName,
      Attributes: []
    };
  
    // Iterate over the properties of the inputObject
    for (const key of Object.keys(inputObject)) {
      if (key !== 'FieldKey' && key !== 'FieldName') {
        model.Attributes.push({
          Key: key,
          Value: inputObject[key] === true ? true : false
        });
      }
    }
    return model;
  }

  UpdateFormPermissions(){
    console.log(JSON.stringify(this.FormkeysList));
    const updatedFormPermissions = {
      FormId: this.selectedFormId,
      CompanyId: this.loginUser.Company.Id,
      FormPermssions:JSON.stringify(this.FormkeysList),
      CreatedDate:new Date()
    }
    this._jobcentralService.UpdateFormLevelPermissions(updatedFormPermissions)
     .subscribe(jcSettings => {
       if(jcSettings.IsError==true){
        this._alertService.error(jcSettings.ErrorMessage);
       }
       else{
        this.IsFormChanged=true;
        this._alertService.success("Setting Saved Successfully");
        this.getJobCentralFormSettings(this.loginUser.Company.Id);
       }
       if(!this.cdr["distroyed"]){
          this.cdr.detectChanges();
        }
      },
      error => {
        this._alertService.error(error);
        if(!this.cdr["distroyed"]){
          this.cdr.detectChanges();
        }
      }
    );
  }


  
}



