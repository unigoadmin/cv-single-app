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
import { City, ConsultantUserProfile, ConsultviteTimeZones, CountriesList, Country, FileUploadResponse, Keywords, LoginUser, State } from 'src/@shared/models';
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
  selector: 'cv-consultant-user-profile',
  templateUrl: './consultant-user-profile.component.html',
  styleUrls: ['./consultant-user-profile.component.scss']
})
export class ConsultantUserProfileComponent implements OnInit {

  form = this.fb.group({
    FirstName: null,
    LastName: null,
    Email: null,
    PhoneCountryExt:null,
    PhoneNumber:null,
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

  currentUser: ConsultantUserProfile;
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


  constructor(private dialogRef: MatDialogRef<ConsultantUserProfileComponent>,
              private fb: FormBuilder,
              private _authService: AuthenticationService,
              private _alertService: AlertService,
              private _accountService:AccountService,
              private _commonService: CommonService,
              private _fileStoreService:FileStoreService,
              private _countryCodeService:CountryCodeService) {
               
               }

  ngOnInit() {
     this.loginUser = this._authService.getLoginUser();
     if (this.loginUser) {
      this.employerId = this.loginUser.UserId;
      this.getConsultantUserProfile(); 
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

  getConsultantUserProfile() {
  forkJoin([
    this._accountService.getConsultantUserProfile(this.loginUser.UserId),
    this._commonService.GetAllTimeZones(),
    this._commonService.getStates(),
    this._commonService.getKeywords(this.loginUser.Company.Id),
    this._countryCodeService.GetCountryCodes()]) 
      .subscribe(
      (responce) => {

          let consultantUser = responce[0];
          this.timezones = responce[1];
          this.states =  responce[2];
          this.keywords = responce[3];
          this.countries = responce[4];
    
          if (consultantUser.PhoneNumber && consultantUser.PhoneNumber.split('-').length > 1) {
            this.phone = consultantUser.PhoneNumber.split('-');
            if(this.phone.length>1){
                this.phone.shift()
                consultantUser.PhoneNumber = this.phone.join('-');
            }
        }

      
        // if(internalUser.Zip){
        //   internalUser.Zip = this._commonService.editZip(employer.Zip,5)
        // }
        if (consultantUser.State)
            this.onCitybyState(consultantUser.State);

        this.currentUser = consultantUser
   
        if (this.currentUser.ProfilePic)
            this.profilePic = this.currentUser.ProfilePic;
        if (this.currentUser.SkillSet)
            this.keywordsText = this.currentUser.SkillSet.split(",");

        if(!this.currentUser.PhoneCountryExt){
          let selectCountryCode=this.countries.find(i=>i.iso2.toLowerCase() == 'us');
          this.currentUser.CountryCode = '+'+selectCountryCode.dialCode;
          this.currentUser.PhoneCountryExt = selectCountryCode.iso2; 
        }else{
          let selectCountryCode=this.countries.find(i=>i.iso2.toLowerCase() == this.currentUser.PhoneCountryExt);
          this.currentUser.CountryCode = '+'+selectCountryCode.dialCode;
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

// onChangeResume(event) {

//     var target = event.target || event.srcElement; //if target isn't there then take srcElement
//     let file = target.files;
    
//    this._fileStoreService.uploadResume(file)
//        .subscribe(response => {
//            this.fileUploadResponse = response;
//            this.currentUser.TempKey = this.fileUploadResponse.ActualFileName;
//            this.currentUser.Resume_Path_Bucket = this.fileUploadResponse.DisplayFileName;
//            this.currentUser.UploadedFileName=file[0].name;
//        },
//        error => {
//            this._alertService.error(error);
//            this._alertService.error("Error while uploading the resume.");
//        });
// }

  saveUser() {
    const form = this.form.value;

    // this.currentUser = {
    //   ...form,
    // };

    this.currentUser.ProfilePic = this.profilePic
    this.currentUser.FirstName = form.FirstName.replace(/\b\w/g, first => first.toLocaleUpperCase());
    this.currentUser.LastName = form.LastName.replace(/\b\w/g, first => first.toLocaleUpperCase());
    this.currentUser.Email = form.Email;
  
    this.currentUser.PhoneCountryExt = form.PhoneCountryExt;
    this.currentUser.PhoneNumber = form.PhoneNumber;
   
    this.currentUser.SkillSet = form.SkillSet;
    this.currentUser.Address1 = form.Address1;
    this.currentUser.Address2 = form.Address2;
    this.currentUser.State = form.State;
    this.currentUser.City = form.City;
    this.currentUser.TimeZoneId = form.TimeZoneId;
    this.currentUser.ZipCode = form.Zip;
  
    this.updateInternalUserProfile();
    
  }

  updateInternalUserProfile() {
        
    //this.currentUser.SkillSet = this.KeywordsComponent.SelectValue.join(",");

    if (this.currentUser.PhoneNumber) {
      this.currentUser.PhoneNumber = this.currentUser.PhoneNumber;
      if(this.currentUser.PhoneCountryExt){
        this.currentUser.PhoneCountryExt = this.currentUser.PhoneCountryExt.toLowerCase();
        let selectCountryCode=this.countries.find(i=>i.iso2.toLowerCase() == this.currentUser.PhoneCountryExt);
        this.currentUser.CountryCode = '+'+selectCountryCode.dialCode;
      }
    }else{
          this.currentUser.PhoneNumber=''
          this.currentUser.CountryCode='';
          this.currentUser.PhoneCountryExt='';
    }
    
   
    if(!this.currentUser.PhoneNumber){
      this._alertService.error("Enter atleast one Phone Number");
    }
    
    this._accountService.updateConsultantUserProfile(this.currentUser)
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
