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
import { CompanyModules, EmployerRoles, Roles } from '../../core/models';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { RoleService } from '../../core/http/role.service';
import { LoginUser } from 'src/@shared/models';
import { ModuleService } from '../../core/http/module.service';

@Component({
  selector: 'cv-roles-edit',
  templateUrl: './roles-edit.component.html',
  styleUrls: ['./roles-edit.component.scss']
})
export class RolesEditComponent implements OnInit {

  form = this.fb.group({
    RoleName: null,
    RoleDescription: null,
    ModuleId: null,
    UserType:null
  });

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

  loginUser: LoginUser;
  title:string;
  companyModules: CompanyModules[];
  companyId: number;
  employerRole:EmployerRoles;

  constructor(@Inject(MAT_DIALOG_DATA) private role: Roles,
              private dialogRef: MatDialogRef<RolesEditComponent>,
              private fb: FormBuilder,
              private _alertService: AlertService,
              private _authService: AuthenticationService,
              private _roleService:RoleService,
              private _moduleService:ModuleService) { }

  ngOnInit() {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.companyId = this.loginUser.Company.Id;
      this.getCompanyActiveModules(this.companyId);
    }

    this.employerRole = <EmployerRoles>{};
    this.employerRole.ModuleId = this.role.ModuleId;
    if (this.role.RoleId) {

      this.employerRole.RoleId = this.role.RoleId;
      this.employerRole.RoleName = this.role.RoleName;
      this.employerRole.RoleDescription = this.role.RoleDescription;
      this.employerRole.CompanyId = this.role.CompanyId;
      this.employerRole.UserType = this.role.UserType;
      this.title =  "Edit Role";
    }
    else{
      this.title =  "New Role";
      }
      this.form.patchValue(this.employerRole);
  }
  
  getCompanyActiveModules(companyId:number) {

    this._moduleService.getCompanyActiveModules(companyId)
      .subscribe(
      (companyModules) => {
          this.companyModules = companyModules;
         
        
      },
      error => {
          this._alertService.error(error);
      });
  }
  
   saveRole() {debugger;
    const form = this.form.value;

    this.employerRole.RoleName = form.RoleName;
    this.employerRole.RoleDescription = form.RoleDescription;
    this.employerRole.ModuleId = form.ModuleId;
    this.employerRole.CompanyId = this.loginUser.Company.Id;
    this.employerRole.Status = true;
    this.employerRole.UserType = form.UserType;
    if (!this.employerRole.RoleId) {
       //this.employerRole.UserType = 3;
       this.createRole()
    }
    else{
       this.updateRole();
    }
   }

   createRole(){debugger;
    this._roleService.createRole(this.employerRole)
    .subscribe(role => {
      
      role.ModuleId = this.employerRole.ModuleId;
      this.dialogRef.close({data:role});
      this._alertService.success("Role created successfully");
    }, error => {
      this._alertService.error(error);
    });
  }

  updateRole(){debugger;
    this._roleService.updateRole(this.employerRole)
    .subscribe(role => {
      role.ModuleId = this.employerRole.ModuleId;
      this.dialogRef.close({data:role});
      this._alertService.success("Role updated successfully");
    }, error => {
      this._alertService.error(error);
    });
  }
}
