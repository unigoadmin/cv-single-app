import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import icStar from '@iconify/icons-ic/twotone-star';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import icPrint from '@iconify/icons-ic/twotone-print';
import icDownload from '@iconify/icons-ic/twotone-cloud-download';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icBusiness from '@iconify/icons-ic/twotone-business';
import icPhone from '@iconify/icons-ic/twotone-phone';
import icEmail from '@iconify/icons-ic/twotone-mail';
import icPerson from '@iconify/icons-ic/twotone-person';
import icStarBorder from '@iconify/icons-ic/twotone-star-border';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import icCloud_Upload from '@iconify/icons-ic/cloud-upload';
import icRemove_Circle_Outline from '@iconify/icons-ic/remove-circle-outline';
import { Company } from '../../../core/models/company';
import { CompanyService } from '../../../core/http/company.service';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { CommonService, FileStoreService } from 'src/@shared/http';
import { City, ConsultviteTimeZones, CountriesList, FileUploadResponse, LoginUser, State } from 'src/@shared/models';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, forkJoin } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { changePhoneFormat } from 'src/@cv/utils/phone-format-change';
import { stagger60ms, stagger80ms } from 'src/@cv/animations/stagger.animation';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { OnBoardingCompanies } from '../../../core/models/onboard-comapines';
import { IconService } from 'src/@shared/services/icon.service';
import { SuperAdminService } from '../../../core/http/superadmin.service';
import { IdentityService } from 'src/app-public/modules/initial/core/http/identity.service';
import { CompanyModules } from '../../../core/models';
import { scaleIn400ms } from 'src/@cv/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@cv/animations/fade-in-right.animation';
import { ModuleService } from '../../../core/http/module.service';

@Component({
  selector: 'cv-manage-tenant-details',
  templateUrl: './manage-tenant-details.component.html',
  styleUrls: ['./manage-tenant-details.component.scss'],
  animations: [
    stagger80ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms
  ],
})
export class ManageTenantDetailsComponent implements OnInit {
  loginUser: LoginUser;
  companyDetails: OnBoardingCompanies = new OnBoardingCompanies();
  company:Company;
  CompanyId:number;
  RootUserId:number;
  companyModules: CompanyModules[];
  public defaultLogo: string = "assets/img/demo/consultvite_logo.png";
  public companyLogo: string = null;
  public RootUserFormGroup: FormGroup;
  profilePic: string = null;
  onbaord_status:string=null;

  icCloud_Upload = icCloud_Upload;
  icRemove_Circle_Outline = icRemove_Circle_Outline;

  icStar = icStar;
  icStarBorder = icStarBorder;
  icMoreVert = icMoreVert;

  icPrint = icPrint;
  icDownload = icDownload;
  icDelete = icDelete;

  icBusiness = icBusiness;
  icPerson = icPerson;
  icEmail = icEmail;
  icPhone = icPhone;
  states: State[];
  cities: City[];
  countries: CountriesList[];
  TimeZones: ConsultviteTimeZones[];
  stateControl: FormControl = new FormControl();
  filteredStates$: Observable<State[]>;
  cityControl: FormControl = new FormControl();
  filteredCities$: Observable<City[]>;
  OnbardingNotes:string;

  fileUploadResponse: FileUploadResponse;
  constructor(@Inject(MAT_DIALOG_DATA) public Data: any,
              private dialogRef: MatDialogRef<ManageTenantDetailsComponent>,
              private fb: FormBuilder,
              public iconService: IconService,
              private _alertService: AlertService,
              private _authService: AuthenticationService,
              private cdRef: ChangeDetectorRef,
              private _service: SuperAdminService,
              private _moduleService: ModuleService)
              {
                this.RootUserFormGroup = this.fb.group({
                  FirstName: [null], 
                  LastName: [null], 
                  Email: [null],
                  PrimaryPhoneNumber: [null], 
                })
               }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {debugger;
      this.CompanyId = this.Data.CompanyID;
      this.RootUserId = this.Data.RootUser;
      this.getCompanyModules();
    }
  }

  getCompanyModules(){
    this._service.getCompanyModules(this.CompanyId).subscribe(response => {
      this.companyModules = response.Data;
    }, error => {
      this._alertService.error(error);
    })
  }


  cancel_modules(){
   //Load the initial modules.
   this.getCompanyModules();
  }

  save_modules(){
    this._service.updateCompanyModules(this.companyModules,this.CompanyId)
    .subscribe(
      response => {
        this.dialogRef.close(this.companyModules);
        this._alertService.success("Modules updated successfully");
        
      },
      error => {
             this._alertService.error(error);
         });
  }

  onbaord_status_change(event){
    
  }

  save_status(){
    
  }

}
