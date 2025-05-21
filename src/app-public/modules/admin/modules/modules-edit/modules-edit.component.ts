import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import icStar from '@iconify/icons-ic/twotone-star';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import icClose from '@iconify/icons-ic/twotone-close';
import icPrint from '@iconify/icons-ic/twotone-print';
import icDownload from '@iconify/icons-ic/twotone-cloud-download';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icBusiness from '@iconify/icons-ic/twotone-business';
import icPhone from '@iconify/icons-ic/twotone-phone';
import icEmail from '@iconify/icons-ic/twotone-mail';
import icPerson from '@iconify/icons-ic/twotone-person';
import icStarBorder from '@iconify/icons-ic/twotone-star-border';
import { FormBuilder } from '@angular/forms';
import { CompanyModules, ConsultviteUser} from '../../core/models';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { LoginUser } from 'src/@shared/models';
import icInfo from '@iconify/icons-ic/twotone-info';
import { ModuleService } from '../../core/http/module.service';


@Component({
  selector: 'cv-modules-edit',
  templateUrl: './modules-edit.component.html',
  styleUrls: ['./modules-edit.component.scss']
})
export class ModulesEditComponent implements OnInit {

  icStar = icStar;
  icStarBorder = icStarBorder;
  icMoreVert = icMoreVert;
  icClose = icClose;

  icPrint = icPrint;
  icDownload = icDownload;
  icDelete = icDelete;

  icBusiness = icBusiness;
  icPerson = icPerson;
  icEmail = icEmail;
  icPhone = icPhone;
  icInfo = icInfo;

  title:string;
  loginUser: LoginUser;
  companyModules: CompanyModules[]=[];

  constructor(@Inject(MAT_DIALOG_DATA) private data: CompanyModules[],
              private dialogRef: MatDialogRef<ModulesEditComponent>,
              private _authService: AuthenticationService,
              private _moduleService: ModuleService,
              private _alertService: AlertService,) {
               this.companyModules = [];
               }

  ngOnInit() {
    this.loginUser = this._authService.getLoginUser();
    if (this.data) {
      this.data.forEach(module=>{
        this.companyModules.push(Object.assign({}, module));
      })
      this.title =  "Activate / Deactivate Modules";
    }
    
  }

  save() {
    this._moduleService.updateCompanyModules(this.companyModules,this.loginUser.Company.Id,this.loginUser.UserId)
    .subscribe(
      response => {
        this.dialogRef.close(this.companyModules);
        this._alertService.success("Modules updated successfully");
        
      },
      error => {
             this._alertService.error(error);
         });
    
  }

  cancel(){debugger;
    this.dialogRef.close(this.companyModules);
  }
  
}
