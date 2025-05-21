import { Component, Inject, OnChanges, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import icPerson from '@iconify/icons-ic/twotone-person';
import { GlobalSettings } from '../../core/models/globalsettings';
import icClose from '@iconify/icons-ic/twotone-close';
import { LoginUser } from 'src/@shared/models';
import {GlobalSettingsCategory} from 'src/static-data/global-settings-category';
import { GlobalSettingsService } from 'src/@shared/http/globalsettings.service';

@Component({
  selector: 'cv-add-gsettings',
  templateUrl: './add-gsettings.component.html',
  styleUrls: ['./add-gsettings.component.scss'],
  providers: [GlobalSettingsCategory]
})
export class AddGsettingsComponent implements OnInit,OnChanges {
  
  loginUser: LoginUser;
  icClose = icClose;
  icPerson = icPerson;
  globalSettings: GlobalSettings = new GlobalSettings();
  MissingCatergoryList:CategoryItem[] =[];
  selectedCategory:GlobalSettings;
  mode:string;
  form = this.fb.group({
    Category: null,
    Prefix: null,
    series: null
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) private Data: any,
    private dialogRef: MatDialogRef<AddGsettingsComponent>,
    private fb: FormBuilder,
    private _authService: AuthenticationService,
    private _alertService: AlertService,
    private categoryTypes: GlobalSettingsCategory,
    private _service:GlobalSettingsService,
  ) { }

  ngOnInit(): void {debugger;
    this.MissingCatergoryList = [];
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.MissingCatergoryList = this.Data.category;
      this.mode = this.Data.mode;
      if(this.mode=="Edit"){
      this.selectedCategory = this.Data.selectedCategory;
       this.MissingCatergoryList = this.categoryTypes.GlobalCategory;
      }
      if(this.mode=="Add"){
        this.selectedCategory = new GlobalSettings();
       }
    }
  }

  ngOnChanges(...args: any[]){debugger;
    
  }

  selectionChange(event) {
    // const i = this.globalSettingsList.findIndex(x => x.Category === event.value);
    // if (i > -1) {
    //   this.ischeck = true;
    //   this._alertService.error('Category already added');
    // } else {
    //   this.ischeck = false;
    // }

  }

  SaveChanges(){
   if(this.mode=="Edit"){
    this.updateGlobalSettings();
   }
   else if(this.mode=="Add"){
    this.saveGlobalSettings();
   }
  }

  saveGlobalSettings() {
    this.globalSettings.Settings_Id=0;
    this.globalSettings.CompanyId = this.loginUser.Company.Id;
    this.globalSettings.Prefix= this.selectedCategory.Prefix;
    this.globalSettings.Series= Number(this.selectedCategory.Series);
    this.globalSettings.Category = this.selectedCategory.Category;
    this.globalSettings.CreatedDate = new Date();
    this._service.SaveGlobalSettings(this.globalSettings).subscribe(response => {
      this._alertService.success("Settings added successfully");
      this.dialogRef.close(true);
    }, error => {
      this._alertService.error(error);
    })
  }

  updateGlobalSettings() {
    this.globalSettings.Settings_Id=this.selectedCategory.Settings_Id;
    this.globalSettings.CompanyId = this.selectedCategory.CompanyId;
    this.globalSettings.Prefix= this.selectedCategory.Prefix;
    this.globalSettings.Series= this.selectedCategory.Series;
    this.globalSettings.Category = this.selectedCategory.Category;
    this.globalSettings.CreatedDate = new Date();
    this._service.SaveGlobalSettings(this.globalSettings).subscribe(response => {
      this._alertService.success("Settings updated successfully");
      this.dialogRef.close(true);
    }, error => {
      this._alertService.error(error);
    })
  }

  OnClose(){debugger;
    this.MissingCatergoryList = [];
    this.dialogRef.close();
  }

}

export interface CategoryItem {
  label: string;
  value: string;
}
