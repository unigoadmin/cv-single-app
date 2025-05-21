import { ChangeDetectorRef, Component,  Input, OnInit } from '@angular/core';
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
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import icCloud_Upload from '@iconify/icons-ic/cloud-upload';
import icRemove_Circle_Outline from '@iconify/icons-ic/remove-circle-outline';
import { Company } from   '../../../core/models/company';
import { CompanyService } from '../../../core/http/company.service';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { CommonService, FileStoreService } from 'src/@shared/http';
import { City, ConsultviteTimeZones, CountriesList, FileUploadResponse, State } from 'src/@shared/models';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, forkJoin } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { changePhoneFormat } from 'src/@cv/utils/phone-format-change';

@Component({
  selector: 'cv-edit-tenant-details',
  templateUrl: './edit-tenant-details.component.html',
  styleUrls: ['./edit-tenant-details.component.scss']
})
export class EditTenantDetailsComponent implements OnInit {

  @Input() companyId:number;
  company: Company = new Company();
  public defaultLogo: string = "assets/img/demo/consultvite_logo.png";
  public companyLogo: string = null;
  form = this.fb.group({
    Name: null,
    Website: null,
    Address1: null,
    Address2: null,
    City: null,
    State: null,
    OperationsCountry: null,
    Currency: null,
    Display_DateFormat: null,
    Display_TimeFormat: null,
    TimeZoneID: null,
    Description: null,
    Email: null,
    Phone: null,
    ZipCode: null,
    status:null,
    IsActive:null
  });

  icCloud_Upload = icCloud_Upload;
  icRemove_Circle_Outline = icRemove_Circle_Outline;

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
  states: State[];
  cities: City[];
  countries: CountriesList[];
  TimeZones: ConsultviteTimeZones[];
  stateControl: FormControl = new FormControl();
  filteredStates$: Observable<State[]>;
  cityControl: FormControl = new FormControl();
  filteredCities$: Observable<City[]>;


  fileUploadResponse: FileUploadResponse;
  constructor(
    private fb: FormBuilder,
    private _companyService: CompanyService,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private _commonService: CommonService,
    private _fileStoreService: FileStoreService,
    private cdRef: ChangeDetectorRef,) {
    this.states = [];
    this.cities = [];
    this.countries = [];

    this.fileUploadResponse = {
      DisplayFileName: '',
      ActualFileName: '',
      UploadedFileName: '',
      ViewResumeInnerPath: '',
      TempKey: ''
    }
  }

  ngOnInit() {
    if(this.companyId > 0){
      this.getCompany(this.companyId);
    }

    this.getStates();
    //this.getCountries();
    //this.getTimeZones();
  }
  getCompany(companyid:number) {
    forkJoin([
      this._companyService.getCompanyById(companyid),
      this._commonService.GetCountries(),
      this._commonService.GetAllTimeZones()]) 
        .subscribe(
        (responce) => {debugger;

            this.company = responce[0];
            this.form.patchValue(this.company);
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

  statefilter(val: string) {
    return this.states.filter(option =>
      option.StateName.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }
  cityfilter(val: string) {
    return this.cities.filter(option =>
      option.CityName.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }
  timezonefilter(val: string) {
    return this.TimeZones.filter(option =>
      option.TimeZoneID.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }
  countryfilter(val: string) {
    return this.countries.filter(option => option.iso3.toLowerCase().indexOf(val.toLowerCase()) === 0)
  }
  getStates() {
    this._commonService.getStates()
      .subscribe(
        states => {
          this.states = states;

          this.filteredStates$ = this.stateControl.valueChanges
            .pipe(
              startWith(''),
              map(val => this.statefilter(val))
            );
        },
        error => {
          this._alertService.error(error);
        })

  }
  getCountries() {
    this._commonService.GetCountries().subscribe(countries => {
      this.countries = countries;
    },
      error => {
        this._alertService.error(error);
      })
  }
  getTimeZones() {
    this._commonService.GetAllTimeZones()
      .subscribe(
        timezones => {
          this.TimeZones = timezones;
        },
        error => {
          this._alertService.error(error);
        })
  }

  onSelectionChanged(event: MatAutocompleteSelectedEvent) {
    const form = this.form.value;
    form.City = null;
    this._commonService.getCitiesByState(event.option.value)
      .subscribe(
        cities => {
          this.cities = cities;
          this.filteredCities$ = this.cityControl.valueChanges
            .pipe(
              startWith(''),
              map(val => this.cityfilter(val))
            );
        },
        error => {
          this._alertService.error(error);
        })
  }
  onCitybyState(state: string) {
    this._commonService.getCitiesByState(state)
      .subscribe(
        cities => {
          this.cities = cities;
          this.filteredCities$ = this.cityControl.valueChanges
            .pipe(
              startWith(''),
              map(val => this.cityfilter(val)));
        },
        error => {
          this._alertService.error(error);
        })
  }
  removeLogo() {
    this.companyLogo = null;
  }
  onChange(event) {

    let file = event.srcElement.files;
    this._fileStoreService.uploadCompanyLogo(file)
      .subscribe(response => {
        this.fileUploadResponse = response;
        this.companyLogo = this.fileUploadResponse.DisplayFileName;

      }),
      error => {
        this._alertService.error("Error while uploading the file.");
      }
  }
  onSave() {
    const form = this.form.value;
    this.company.Logo = this.companyLogo
    this.company.Name = form.Name.replace(/\b\w/g, first => first.toLocaleUpperCase());
    this.company.Website = form.Website;
    // this.company.Address1 = form.Address1;
    // this.company.Address2 = form.Address2;
    // this.company.City = form.City;
    // this.company.State = form.State;
    this.company.OperationsCountry = form.OperationsCountry;
    this.company.Currency = form.Currency;
    this.company.Display_DateFormat = form.Display_DateFormat;
    this.company.Display_TimeFormat = form.Display_TimeFormat;
    this.company.TimeZoneID = form.TimeZoneID;
    this.company.Description = form.Description;
    this.company.Email = form.Email;
    this.company.Phone = form.Phone;

    this._companyService.updateCompany(this.company).subscribe(
      responce => {

        this._alertService.success("Company information is updated successfully");

      },
      error => {
        this._alertService.error("Error while updating company information");
      });

  }

  PhoneChange() {
    const form = this.form.value;
    if (form.Phone) {
      form.phone = changePhoneFormat(form.Phone);
    }
  }

  getAddress(event) {
    debugger;
    let data = event.address_components
    this.company.Address2 = null;
    this.company.Address1 = null;
    this.company.City = null;
    this.company.State = null;
    this.company.OperationsCountry = null;
    this.company.ZipCode = null;
    if (data != undefined && data.length > 0) {
      for (let address of data) {
        if (address.types.includes("street_number")) {
          debugger;
          //this.company.Address1 = address.long_name;
        } else if (address.types.includes("route")) {
          this.company.Address1 = address.long_name;
          //this.company.Address1 = isNullOrUndefined(this.company.Address1) ? "" : this.company.Address1 + " " + address.long_name;
        } else if (address.types.includes("locality")) {
          this.company.City = address.long_name;
        } else if (address.types.includes("administrative_area_level_1")) {
          this.company.State = address.short_name;
        } else if (address.types.includes("country")) {
          this.company.OperationsCountry = address.short_name;
        } else if (address.types.includes("postal_code")) {
          this.company.ZipCode = address.long_name;
        }
      }
    }
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }

  emitToggleStatus(event){

  }


  inputEmployeeAddress(event) {
    this.getAddress(event.target.value);
  }
}
