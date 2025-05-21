import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CompanyEditComponent } from './company-edit/company-edit.component';
import { MatDialog } from '@angular/material/dialog';
import icEdit from '@iconify/icons-ic/twotone-edit';
import { CompanyService } from '../core/http/company.service';
import { Company } from '../core/models/company';
import {  ConsultviteTimeZones, CountriesList, LoginUser } from 'src/@shared/models';
import { AlertService , AuthenticationService } from 'src/@shared/services';
import { forkJoin } from 'rxjs';
import { CommonService } from 'src/@shared/http';
import icBusiness  from '@iconify/icons-ic/business'
import { changePhoneFormat } from 'src/@cv/utils/phone-format-change';


//@UntilDestroy()
@Component({
  selector: 'cv-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'standard'
      } as MatFormFieldDefaultOptions
    }
  ]
})
export class CompanyComponent implements OnInit ,AfterViewInit {

  icEdit = icEdit;
  icBusiness=icBusiness;
  companyId: number;
  loginUser: LoginUser;
  company:Company;
  countries:CountriesList[];
  TimeZones:ConsultviteTimeZones[];
  public defaultLogo: string = "assets/img/demo/consultvite_logo.png";
  public companyLogo: string = null;
  constructor(private dialog: MatDialog,
    private _companyService:CompanyService,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private _commonService: CommonService,
   ) { 
      
      this.company = new Company();
      this.countries =[];
      this.TimeZones = [];
    }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
        this.companyId = this.loginUser.Company.Id;
        this.getCompany(this.companyId);
    }
    
  }
  
  ngAfterViewInit() {
  }

  openCompany(company:Company){
    this.dialog.open(CompanyEditComponent, {
      data: company || null,
      width: '80vw',
      disableClose: true
    });
  }

  getCompany(companyid:number) {
    forkJoin([
      this._companyService.getCompanyById(companyid),
      this._commonService.GetCountries(),
      this._commonService.GetAllTimeZones()]) 
        .subscribe(
        (responce) => {

            this.company = responce[0];
            this.countries = responce[1];
            this.TimeZones = responce[2];
            if(this.company.Phone){
              this.company.Phone = changePhoneFormat(this.company.Phone);
            }
            if (this.company.Logo)
                this.companyLogo = this.company.Logo;
            if(this.company.OperationsCountry)
               this.company.OperationsCountryName = this.countries.find(i=>i.iso3 == this.company.OperationsCountry).display_name;  
            if(this.company.TimeZoneID){
              let timezone =this.TimeZones.find(i=>parseInt(i.TimeZoneID) == this.company.TimeZoneID);
              this.company.TimeZoneName = timezone.TimeZoneName + " " + timezone.UTC;
            }
        },
        error => {
            this._alertService.error(error);
        });
   }

}
