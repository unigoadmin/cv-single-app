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
import icDetails from '@iconify/icons-ic/twotone-details';
import { FormBuilder, Validators } from '@angular/forms';
import icEnhanced_Encryption from '@iconify/icons-ic/enhanced-encryption'
import icAdd_Moderator from '@iconify/icons-ic/twotone-add-moderator'
import { Company, CompanyModules, ConsultviteUser, UserSecurity } from '../../core/models';
import { AlertService, AuthenticationService, CountryCodeService } from 'src/@shared/services';
import { CountriesList, Country, LoginUser } from 'src/@shared/models';
import { UserService } from '../../core/http/user.service';
import icInfo from '@iconify/icons-ic/twotone-info';
import { stagger80ms } from 'src/@cv/animations/stagger.animation';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { scaleIn400ms } from 'src/@cv/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@cv/animations/fade-in-right.animation';
import { ValidationService } from 'src/@cv/services/validation.service';


@Component({
  selector: 'cv-users-edit',
  templateUrl: './users-edit.component.html',
  styleUrls: ['./users-edit.component.scss'],
  animations: [
    stagger80ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms
  ],
})
export class UsersEditComponent implements OnInit {

  form = this.fb.group({
    FirstName: null,
    LastName: null,
    Email:  [null, [Validators.required, ValidationService.emailValidator]],
    PhoneNo: [null, [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
    PhoneCountryExt: null,
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
  icInfo = icInfo;
  icEnhanced_Encryption = icEnhanced_Encryption;
  icAdd_Moderator = icAdd_Moderator;
  icDetails = icDetails;

  title: string;
  btntitle:string;
  loginUser: LoginUser;
  usermodules: CompanyModules[];
  moduleRoles: CompanyModules[];
  user: ConsultviteUser = <ConsultviteUser>{};
  phone: string[];
  countries: Country[];
  selectedCountry: CountriesList;

  constructor(@Inject(MAT_DIALOG_DATA) data: ConsultviteUser,
    private dialogRef: MatDialogRef<UsersEditComponent>,
    private fb: FormBuilder,
    private _authService: AuthenticationService,
    private _userService: UserService,
    private _alertService: AlertService,
    private _countryCodeService: CountryCodeService) {
    this.user = Object.assign({}, data);
  }

  ngOnInit() {
    this.loginUser = this._authService.getLoginUser();
    if (this.user.UserId) {
      this.form.patchValue(this.user);
      this.form.controls['Email'].disable();

      if (this.user.PhoneNo && this.user.PhoneNo.split('-').length > 1) {
        this.phone = this.user.PhoneNo.split('-');
        if (this.phone.length > 1) {
          this.phone.shift()
          this.user.PhoneNo = this.phone.join('-');
        }
      }



      if (this.user.UserType == 0) {
        this.title = "Edit Consultant User";
        this.btntitle = "SAVE CHANGES";
        this.getConsultantUserRolesByUserId(this.loginUser.Company.Id, this.user.UserId)
        this.getConsultantUserSecurityByUserId(this.loginUser.Company.Id, this.user.UserId);
      }
      else {
        this.title = "Edit Internal User";
        this.btntitle = "SAVE CHANGES";
        this.getInternalUserRolesByUserId(this.loginUser.Company.Id, this.user.UserId);
        this.getInternalUserSecurityByUserId(this.loginUser.Company.Id, this.user.UserId);
      }
    }
    else {
      this.user.Security = <UserSecurity>{};
      if (this.user.UserType == 0) {
        this.title = "New Consultant User";
        this.btntitle = "CREATE";
        this.getConsultantUserRolesByCompanyId(this.loginUser.Company.Id)
      }
      else {
        this.title = "New Internal User";
        this.btntitle = "CREATE";
        this.getInternalUserRolesByCompanyId(this.loginUser.Company.Id)
      }
    }
    this.getCountryCodes();
  }

  getCountryCodes() {
    this.countries = [];
    this._countryCodeService.GetCountryCodes()
      .subscribe(
        countries => {
          this.countries = countries;

          if (!this.user.PhoneCountryExt) {
            let selectCountryCode = this.countries.find(i => i.iso2.toLowerCase() == 'us');
            this.user.CountryCode = '+' + selectCountryCode.dialCode;
            this.user.PhoneCountryExt = selectCountryCode.iso2;
          } else {
            let selectCountryCode = this.countries.find(i => i.iso2.toLowerCase() == this.user.PhoneCountryExt);
            this.user.CountryCode = '+' + selectCountryCode.dialCode;
          }
          this.form.patchValue(this.user);
        },
        error => {
          this._alertService.error(error);
        });
  }

  getInternalUserSecurityByUserId(companyId: number, userId: string): void {
    this.user.Security = <UserSecurity>{};
    this._userService.getInternalUserSecurityByUserId(companyId, userId)
      .subscribe(
        userSecurity => {
          this.user.Security = userSecurity;
        },
        error => {
          this._alertService.error(error);
        });
  }

  getInternalUserRolesByUserId(companyId: number, userId: string): void {

    this.moduleRoles = null;
    this._userService.getInternalUserRolesByUserId(companyId, userId)
      .subscribe(
        mroles => {
          this.moduleRoles = mroles;
          this.moduleRoles.forEach(moduleRole => {
            if (moduleRole.Roles.length > 0 && moduleRole.SelectedRoleId != null) {
              moduleRole.SelectedRoleDescription = moduleRole.Roles.find(i => i.RoleId == moduleRole.SelectedRoleId)?.RoleDescription;
            }
          })

        },
        error => {
          this._alertService.error(error);
        }
      );
  }

  getInternalUserRolesByCompanyId(companyId: number): void {
    this._userService.getInternalUserRolesByCompanyId(companyId)
      .subscribe(
        mroles => {
          this.moduleRoles = mroles;
          this.moduleRoles.forEach(moduleRole => {
            if (moduleRole.Roles.length > 0) {
              moduleRole.SelectedRoleDescription = moduleRole.Roles.find(i => i.RoleId == moduleRole.SelectedRoleId)?.RoleDescription;
            }

          })
        },
        error => {
          this._alertService.error(error);
        }
      );
  }

  getConsultantUserSecurityByUserId(companyId: number, userId: string): void {
    this.user.Security = <UserSecurity>{};
    this._userService.getConsultantUserSecurityByUserId(companyId, userId)
      .subscribe(
        userSecurity => {
          this.user.Security = userSecurity;

        },
        error => {
          this._alertService.error(error);
        });
  }

  getConsultantUserRolesByUserId(companyId: number, userId: string): void {

    this.moduleRoles = null;
    this._userService.getConsultantUserRolesByUserId(companyId, userId)
      .subscribe(
        moduleroles => {

          this.moduleRoles = moduleroles;
          this.moduleRoles.forEach(moduleRole => {
            moduleRole.SelectedRoleDescription = moduleRole.Roles.find(i => i.RoleId == moduleRole.SelectedRoleId)?.RoleDescription;
          })

        },
        error => {
          this._alertService.error(error);
        }
      );
  }

  getConsultantUserRolesByCompanyId(companyId: number): void {
    this._userService.getConsultantUserRolesByCompanyId(companyId)
      .subscribe(
        moduleroles => {
          this.moduleRoles = moduleroles;
          this.moduleRoles.forEach(moduleRole => {
            moduleRole.SelectedRoleDescription = moduleRole.Roles.find(i => i.RoleId == moduleRole.SelectedRoleId)?.RoleDescription;
          })
        },
        error => {
          this._alertService.error(error);
        }
      );
  }

  onAdminSelect(isAdministrator: boolean) {
    if (isAdministrator) {
      this.user.UserType = 2; // User Type as Admin
      this.moduleRoles.forEach(moduleRole => {
        //if(moduleRole.IsDefault!=true && moduleRole.Roles.length>0)
        if (moduleRole.Roles.length > 0)
          moduleRole.SelectedRoleId = moduleRole.Roles.find(i => i.RoleName == 'Administrator').RoleId; //Admin Roles
        moduleRole.SelectedRoleDescription = moduleRole.Roles.find(i => i.RoleId == moduleRole.SelectedRoleId)?.RoleDescription;
      })
    }
    else {
      this.user.UserType = 3; //User Type as candidate
      this.moduleRoles.forEach(moduleRole => {
        if (moduleRole.Roles.length > 0)
          moduleRole.SelectedRoleId = moduleRole.Roles[0].RoleId;//Default Roles
        moduleRole.SelectedRoleDescription = moduleRole.Roles.find(i => i.RoleId == moduleRole.SelectedRoleId)?.RoleDescription;

      })
    }
  }

  onSelectedRoleChange(mRoles: CompanyModules, event: any) {
    mRoles.SelectedRoleId = event.value;
    mRoles.SelectedRoleDescription = mRoles.Roles.find(i => i.RoleId == event.value)?.RoleDescription;
  }

  onTwoFactorAuthChange(twoFactorEnabled: boolean) {
    this.user.Security.TwoFactorEnabled = twoFactorEnabled;
  }

  saveUser() {
    const form = this.form.value;

    this.user.FirstName = form.FirstName.replace(/\b\w/g, first => first.toLocaleUpperCase());
    this.user.LastName = form.LastName.replace(/\b\w/g, first => first.toLocaleUpperCase());

    this.user.PhoneNo = form.PhoneNo;
    this.user.PhoneCountryExt = form.PhoneCountryExt;
    if (this.user.UserType != 0)
      this.user.UserType = form.IsAdmin == true ? 2 : 3;
    this.user.CreatedDate = null;
    this.user.LastLoggedIn = null;
    this.user.IsActive = true;

    this.user.CompanyId = this.loginUser.Company.Id;
    this.user.Modules = this.moduleRoles;

    if (this.user.PhoneNo) {
      if (this.user.PhoneCountryExt) {
        this.user.PhoneCountryExt = this.user.PhoneCountryExt.toLowerCase();
        let selectCountryCode = this.countries.find(i => i.iso2.toLowerCase() == this.user.PhoneCountryExt);
        this.user.CountryCode = '+' + selectCountryCode.dialCode;
      }
    } else {
      this.user.PhoneCountryExt = ''
      this.user.CountryCode = '';
      this.user.PhoneCountryExt = '';
    }

    if (this.user.UserId) {
      this.user.UpdatedBy = this.loginUser.UserId;
      this.updateUser();
    }
    else {
      this.user.Email = form.Email;
      this.user.CreatedBy = this.loginUser.UserId;
      this.createUser();
    }

  }
  createUser() {

    if (this.user.UserType == 0) {
      this._userService.createConsultantUser(this.user)
        .subscribe(
          consultantUser => {
            this.user.UserId = consultantUser.UserId;
            this.dialogRef.close({ data: this.user });
            this._alertService.success("Consultant user is created Successfully");
          },
          error => {
            this._alertService.error(error);
          });
    } else {
      this._userService.createInternalUser(this.user)
        .subscribe(
          internalUser => {
            this.user.UserId = internalUser.UserId;
            this.dialogRef.close({ data: this.user });
            this._alertService.success("Internal user is created Successfully");
          },
          error => {
            this._alertService.error(error);
          });
    }
  }
  updateUser() {
    if (this.user.UserType == 0) {
      this._userService.updateConsultantUser(this.user)
        .subscribe(
          consultantUser => {
            this.dialogRef.close({ data: this.user });
            this._alertService.success("Consultant user is saved Successfully");
          },
          error => {
            this._alertService.error(error);
          });
    } else {
      this._userService.updateInternalUser(this.user)
        .subscribe(
          internalUser => {
            this.dialogRef.close({ data: this.user });
            this._alertService.success("Internal user is saved Successfully");
          },
          error => {
            this._alertService.error(error);
          });
    }
  }
}
