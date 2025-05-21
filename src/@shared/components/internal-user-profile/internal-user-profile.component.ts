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
import { FormBuilder, FormControl } from '@angular/forms';
import { AlertService, AuthenticationService, CountryCodeService } from 'src/@shared/services';
import { City, ConsultviteTimeZones, CountriesList, Country, FileUploadResponse, InternalUserProfile, Keywords, LoginUser, State } from 'src/@shared/models';
import icInfo from '@iconify/icons-ic/twotone-info';
import { forkJoin, Observable } from 'rxjs';
import { AccountService, CommonService, FileStoreService } from 'src/@shared/http';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import icCloud_Upload from '@iconify/icons-ic/cloud-upload';
import icRemove_Circle_Outline from '@iconify/icons-ic/remove-circle-outline';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icRemove_Red_Eye from '@iconify/icons-ic/twotone-remove-red-eye';


@Component({
  selector: 'cv-internal-user-profile',
  templateUrl: './internal-user-profile.component.html',
  styleUrls: ['./internal-user-profile.component.scss']
})
export class InternalUserProfileComponent implements OnInit {

  form = this.fb.group({
    FirstName: null,
    LastName: null,
    PrimaryEmail: null,
    SecondaryEmail: null,
    PrimaryPhoneCountryExt:null,
    PrimaryPhoneNo:null,
    PrimaryPhoneExt:null,
    SecondaryPhoneCountryExt:null,
    SecondaryPhoneNo:null,
    SecondaryPhoneExt:null,
    SkillSet:null,
    Address1:null,
    Address2:null,
    State:null,
    City:null,
    TimeZoneId:null,
    Zip:null,
    
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
  icCloud_Upload = icCloud_Upload;
  icRemove_Circle_Outline = icRemove_Circle_Outline;
  icEdit = icEdit;
  icRemove_Red_Eye = icRemove_Red_Eye;

  title:string;
  loginUser: LoginUser;

  stateControl: FormControl = new FormControl();
  filteredStates$: Observable<any>;
  cityControl:FormControl=new FormControl();
  filteredCities$: Observable<any>;
  timezoneControl:FormControl=new FormControl();
  timezoneOptions: Observable<any>;
  primaryCountryControl:FormControl=new FormControl();
  secondaryCountryControl:FormControl=new FormControl();
  primaryFilteredCountries$: Observable<any>;
  secondaryFilteredCountries$: Observable<any>;

  currentUser: InternalUserProfile;
  employerId: string;
  elementRef;
  fileUploadResponse: FileUploadResponse;
  profileEditForm: any;
  keywords: Keywords[];
  keywordsText: string[];
  states: State[];
  cities: City[];
  phone: string[];
  profilePic: string = null;
  timezones:ConsultviteTimeZones[];
  countries:Country[];
  isEditMode:boolean=false;
  timeZoneName:string = null;
  selectedCountry:CountriesList;


  constructor(private dialogRef: MatDialogRef<InternalUserProfileComponent>,
              private fb: FormBuilder,
              private _authService: AuthenticationService,
              private _alertService: AlertService,
              private _accountService:AccountService,
              private _commonService: CommonService,
              private _fileStoreService:FileStoreService,
              private _countryCodeService:CountryCodeService) {
               
               }

  ngOnInit() {debugger;
     this.loginUser = this._authService.getLoginUser();
     if (this.loginUser) {
      this.employerId = this.loginUser.UserId;
      this.getInternalUserRolesByUserId(); 
      }
      this.title =  "My Profile";
  }

  statefilter(val: string){
    return this.states.filter(option =>
      option.StateName.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }
  cityfilter(val:string){
    return this.cities.filter(option =>
        option.CityName.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }
  timezonefilter(val:string){
    return this.timezones.filter(option =>
        option.TimeZoneID.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }
  countryfilter(val:string){
    return this.countries.filter(option =>
        option.iso2.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  onSelectionChanged(event: MatAutocompleteSelectedEvent) {
  this.currentUser.City=null;
  this._commonService.getCitiesByState(event.option.value)
      .subscribe(
      cities => {
          this.cities = cities;
          this.filteredCities$=this.cityControl.valueChanges
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
            this.filteredCities$=this.cityControl.valueChanges
            .pipe(
              startWith(''),
              map(val => this.cityfilter(val)));
        },
        error => {
            this._alertService.error(error);
        })
  }

 getInternalUserRolesByUserId() {
  forkJoin([
    this._accountService.getInternalUserProfile(this.loginUser.UserId),
    this._commonService.GetAllTimeZones(),
    this._commonService.getStates(),
    this._commonService.getKeywords(this.loginUser.Company.Id),
    this._countryCodeService.GetCountryCodes()]) 
      .subscribe(
      (responce) => {

          let internalUser = responce[0];
          this.timezones = responce[1];
          this.states =  responce[2];
          this.keywords = responce[3];
          this.countries = responce[4];
    
          if (internalUser.PrimaryPhoneNo && internalUser.PrimaryPhoneNo.split('-').length > 1) {
            this.phone = internalUser.PrimaryPhoneNo.split('-');
            if(this.phone.length>1){
                this.phone.shift()
                internalUser.PrimaryPhoneNo = this.phone.join('-');
            }
        }

        if (internalUser.SecondaryPhoneNo && internalUser.SecondaryPhoneNo.split('-').length > 1) {
            this.phone = internalUser.SecondaryPhoneNo.split('-');
            if(this.phone.length>1){
            this.phone.shift()
            internalUser.SecondaryPhoneNo = this.phone.join('-');
            }
        }
        // if(internalUser.Zip){
        //   internalUser.Zip = this._commonService.editZip(employer.Zip,5)
        // }
        if (internalUser.State)
            this.onCitybyState(internalUser.State);

        this.currentUser = internalUser
   
        if (this.currentUser.ProfilePic)
            this.profilePic = this.currentUser.ProfilePic;
        if (this.currentUser.SkillSet)
            this.keywordsText = this.currentUser.SkillSet.split(",");

        if(!this.currentUser.PrimaryPhoneCountryExt){
          let selectCountryCode=this.countries.find(i=>i.iso2.toLowerCase() == 'us');
          this.currentUser.PrimaryCountryCode = '+'+selectCountryCode.dialCode;
          this.currentUser.PrimaryPhoneCountryExt = selectCountryCode.iso2; 
        }else{
          let selectCountryCode=this.countries.find(i=>i.iso2.toLowerCase() == this.currentUser.PrimaryPhoneCountryExt);
          this.currentUser.PrimaryCountryCode = '+'+selectCountryCode.dialCode;
        }
        if(!this.currentUser.SecondaryPhoneCountryExt){
          let selectCountryCode=this.countries.find(i=>i.iso2.toLowerCase() == 'us');
          this.currentUser.SecondaryCountryCode = '+'+selectCountryCode.dialCode;
          this.currentUser.SecondaryPhoneCountryExt = selectCountryCode.iso2; 
        }else{
          let selectCountryCode=this.countries.find(i=>i.iso2.toLowerCase() == this.currentUser.SecondaryPhoneCountryExt);
          this.currentUser.SecondaryCountryCode = '+'+selectCountryCode.dialCode;
        }
       

        this.form.patchValue(this.currentUser);


        if(this.currentUser.TimeZoneId){
          let timezone =this.timezones.find(i=>parseInt(i.TimeZoneID) == this.currentUser.TimeZoneId);
          this.timeZoneName = timezone.TimeZoneName + " " + timezone.UTC; 
        }


        this.timezoneOptions=this.timezoneControl.valueChanges
        .pipe(
            startWith(''),
            map(val => this.timezonefilter(val))
          );

          this.filteredStates$ = this.stateControl.valueChanges
          .pipe(
            startWith(''),
            map(val => this.statefilter(val))
          );

          this.primaryFilteredCountries$=this.primaryCountryControl.valueChanges
          .pipe(
            startWith(''),
            map(val => this.countryfilter(val))
          );

          this.secondaryFilteredCountries$=this.secondaryCountryControl.valueChanges
          .pipe(
            startWith(''),
            map(val => this.countryfilter(val))
          );
      },
      error => {
          this._alertService.error(error);
      });
 }
  
 removeProfilePicture(){

 }

onChange(event) {
  let file = event.srcElement.files;
  this._fileStoreService.uploadProfilePicture(file)
      .subscribe(response => {
          this.fileUploadResponse = response;
          this.profilePic = this.fileUploadResponse.DisplayFileName;
        
      }),
      error => {
          this._alertService.error("Error while uploading the profile picture.");
      }
}

  saveUser() {
    const form = this.form.value;

    // this.currentUser = {
    //   ...form,
    // };

    this.currentUser.ProfilePic = this.profilePic
    this.currentUser.FirstName = form.FirstName.replace(/\b\w/g, first => first.toLocaleUpperCase());
    this.currentUser.LastName = form.LastName.replace(/\b\w/g, first => first.toLocaleUpperCase());
    this.currentUser.PrimaryEmail = form.PrimaryEmail;
    this.currentUser.SecondaryEmail = form.SecondaryEmail;
    this.currentUser.PrimaryPhoneCountryExt = form.PrimaryPhoneCountryExt;
    this.currentUser.PrimaryPhoneNo = form.PrimaryPhoneNo;
    this.currentUser.PrimaryPhoneExt = form.PrimaryPhoneExt;
    this.currentUser.SecondaryPhoneCountryExt = form.SecondaryPhoneCountryExt;
    this.currentUser.SecondaryPhoneNo = form.SecondaryPhoneNo;
    this.currentUser.SecondaryPhoneExt = form.SecondaryPhoneExt;
    this.currentUser.SkillSet = form.SkillSet;
    this.currentUser.Address1 = form.Address1;
    this.currentUser.Address2 = form.Address2;
    this.currentUser.State = form.State;
    this.currentUser.City = form.City;
    this.currentUser.TimeZoneId = form.TimeZoneId;
    this.currentUser.Zip = form.Zip;
  
    this.updateInternalUserProfile();
    
  }

  updateInternalUserProfile() {
        
    //this.currentUser.SkillSet = this.KeywordsComponent.SelectValue.join(",");

    if (this.currentUser.PrimaryPhoneNo) {
      this.currentUser.PrimaryPhoneNo = this.currentUser.PrimaryPhoneNo;
      if(this.currentUser.PrimaryPhoneCountryExt){
        this.currentUser.PrimaryPhoneCountryExt = this.currentUser.PrimaryPhoneCountryExt.toLowerCase();
        let selectCountryCode=this.countries.find(i=>i.iso2.toLowerCase() == this.currentUser.PrimaryPhoneCountryExt);
        this.currentUser.PrimaryCountryCode =   '+' + selectCountryCode.dialCode;
      }
    }else{
          this.currentUser.PrimaryPhoneNo=''
          this.currentUser.PrimaryCountryCode='';
          this.currentUser.PrimaryPhoneCountryExt='';
    }
    if (this.currentUser.SecondaryPhoneNo) {
        this.currentUser.SecondaryPhoneNo = this.currentUser.SecondaryPhoneNo;
        if(this.currentUser.SecondaryPhoneCountryExt){
          this.currentUser.SecondaryPhoneCountryExt = this.currentUser.SecondaryPhoneCountryExt.toLowerCase();
          let selectCountryCode=this.countries.find(i=>i.iso2.toLowerCase() == this.currentUser.SecondaryPhoneCountryExt);
          this.currentUser.SecondaryCountryCode = this.currentUser.SecondaryCountryCode + '+'+selectCountryCode.dialCode;
        }
    }else{
        this.currentUser.SecondaryPhoneNo='';
        this.currentUser.SecondaryCountryCode='';
        this.currentUser.SecondaryPhoneCountryExt='';
    }
   
    if(!this.currentUser.PrimaryPhoneNo){
      this._alertService.error("Enter atleast one Phone Number");
    }
    console.log(this.currentUser);
    this._accountService.updateInternalUserProfile(this.currentUser)
        .subscribe(
        response => {
            this._alertService.success("Profile updated successfully");
            if (this.currentUser.ProfilePic) {
                this.loginUser.ProfilePic = this.currentUser.ProfilePic
            }
            else {
                //this.currentUser.ProfilePic = this.defaultProfilePic;
            }

            this.dialogRef.close();
        },
        error => {
            this._alertService.error(error);
           
        });
  }

  
}
  
