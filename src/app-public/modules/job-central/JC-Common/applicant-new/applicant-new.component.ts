import { ChangeDetectorRef, Component, Inject, OnInit,TemplateRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmitterService } from 'src/@cv/services/emitter.service';
import { FileUploadResponse, LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService, TimeZoneService } from 'src/@shared/services';
import { JobCentralService } from '../../core/http/job-central.service';
import { BenchCandidate } from 'src/@shared/models/common/benchcandidate';
import iclocationon from '@iconify/icons-ic/location-on';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { isNullOrUndefined } from 'src/@shared/services/helpers';
import icInfo from '@iconify/icons-ic/twotone-info';
import icBook from '@iconify/icons-ic/twotone-book';
import icEye from '@iconify/icons-ic/twotone-remove-red-eye';
import { iconsIC } from 'src/static-data/icons-ic';
import icClose from '@iconify/icons-ic/twotone-close';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApplicantReferences } from '../../core/model/applicantrefences';
import { ValidationService } from 'src/@cv/services/validation.service';
import { UntilDestroy } from '@ngneat/until-destroy';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import icPictureAsPdf from '@iconify/icons-ic/twotone-picture-as-pdf';
import icfileupload from '@iconify/icons-ic/file-upload';
import { Observable, Subject } from 'rxjs';
import { HashTag } from 'src/@shared/models/hashtags';
import { ApplicantMaster } from '../../core/model/applicantmaster';
import { SelectItem } from 'src/@shared/models/common/selectitem';
import { AccountTypesEnum } from 'src/@cv/models/accounttypeenum';
import { AccountTypes } from 'src/static-data/accounttypes';
import icnote from '@iconify/icons-ic/note';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { WorkStatusService } from 'src/@shared/http/work-status.service';

@UntilDestroy()
@Component({
  selector: 'cv-applicant-new',
  templateUrl: './applicant-new.component.html',
  styleUrls: ['./applicant-new.component.scss'],
  animations: [
    fadeInUp400ms,
  ],
  providers: [AccountTypes]
})
export class ApplicantNewComponent implements OnInit {

  loginUser: LoginUser;
  SelectedCandidate: BenchCandidate;
  currentApplicant: ApplicantMaster = new ApplicantMaster();
  applicantsRefrences: ApplicantReferences[] = [];
  iclocationon = iclocationon;
  icPictureAsPdf=icPictureAsPdf;
  icfileupload=icfileupload;
  fileUploadLoading: boolean = false;
  fileUploadResponse: FileUploadResponse;
  keywordsText: string[];
  CertificationsText: string[];
  AssignToNames:string[]=[];
  index: number = 0;
  Default: string = "true";
  icInfo=icInfo;
  icBook=icBook;
  icEye=icEye;
  icClose=icClose;
  icDownload:string;
  icnote=icnote;
  status_textClass: any = 'text-amber-contrast';
  status_bgClass: any = 'bg-amber';
  AssigneName: string = null;
  ReviweAssigneeCtrl: FormControl = new FormControl();
  addForm: FormGroup;
  ref1FromGroup: FormGroup;
  ref2FromGroup: FormGroup;
  c2cFromGroup: FormGroup;
  reference1: ApplicantReferences = new ApplicantReferences();
  reference2: ApplicantReferences = new ApplicantReferences();
  c2creference: ApplicantReferences = new ApplicantReferences();
  hashtags: HashTag[];
  HashTagCtrl = new FormControl();
  AllHashTags: string[] = [];
  filteredHashTags: Observable<any[]>;
  selectedHashTagChips: any[] = [];
  SelectedHashTags: any;

  chipsControl = new FormControl();
  chipsControlValue$ = this.chipsControl.valueChanges;
  unsubscribe$: Subject<void> = new Subject<void>();
  workStatuFields: SelectItem[] = []; 
  enumAccountTypes: typeof AccountTypesEnum = AccountTypesEnum;
  isSummary: boolean = false;
  isnotes: boolean = false;
  datemask = [/\d/, /\d/, '/', /\d/, /\d/];
  constructor(@Inject(MAT_DIALOG_DATA) public def_applicantId: any,
    private dialogRef: MatDialogRef<ApplicantNewComponent>,
    private _authService: AuthenticationService,
    private jobCentralService: JobCentralService,
    private _alertService: AlertService,
    private cdRef: ChangeDetectorRef,
    private matIconRegistry: MatIconRegistry,
    private domSanitzer: DomSanitizer,
    private fb: FormBuilder,
    private accountTypes: AccountTypes,
    private workStatusService: WorkStatusService 
  ) { 
    this.icDownload = iconsIC.find(iconName => iconName == "font_download");
    this.SelectedCandidate = new BenchCandidate();
    this.matIconRegistry.addSvgIcon(
      'linkedin',
      this.domSanitzer.bypassSecurityTrustResourceUrl('assets/img/demo/rounded_linkedin.svg')
    );
    this.matIconRegistry.addSvgIcon('disable-linkedin', this.domSanitzer.bypassSecurityTrustResourceUrl('assets/img/demo/rounded_linkedin-disable.svg'));
    this.keywordsText = [];
    this.CertificationsText = [];

    this.Default = localStorage.getItem("Default");
    if (!isNullOrUndefined(this.Default) && this.Default != '') {
      if (this.Default === "true")
        this.index = 0;
      else
        this.index = 1;
    }
    this.addForm = this.fb.group({
      firstName: [null, [Validators.required, ValidationService.onlyAlphabetsValidator]],
      lastName: [null, [Validators.required, ValidationService.onlyAlphabetsValidator]],
      AvailabilityToJoin: [],
      DOB: [],
      SSN: [null,[ValidationService.ValidateSSN]],
      phone: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      LinkedIn: [null],
      ApplicantLocation: [null],
      Notes: [null],
      workCategory: [],
      PayRate: [null],
      c2cfirstName:[null],
      c2clastName:[null],
      c2cphonenumber:[null],
      c2cemail:[null],
      jobtitle:[null],
      wpermit:[null],
    });
    this.ref1FromGroup = this.fb.group({
      firstName: [null, [Validators.required, ValidationService.onlyAlphabetsValidator]],
      lastName: [null, [Validators.required, ValidationService.onlyAlphabetsValidator]],
      company: [null],
      designation: [null],
      email: [null],
      phonenumber: [null]
    });
    this.ref2FromGroup = this.fb.group({
      firstName: [null, [Validators.required, ValidationService.onlyAlphabetsValidator]],
      lastName: [null, [Validators.required, ValidationService.onlyAlphabetsValidator]],
      company: [null],
      designation: [null],
      email: [null],
      phonenumber: [null]
    });
    this.c2cFromGroup = this.fb.group({
      firstName: [null, [Validators.required, ValidationService.onlyAlphabetsValidator]],
      lastName: [null, [Validators.required, ValidationService.onlyAlphabetsValidator]],
      email: [null],
      phonenumber: [null]
    });
  }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.isSummary=true;
      EmitterService.get("JobCentral").emit("JobCentral");
      this.GetHashtags();
      this.workStatusService.getWorkStatusFields(this.loginUser.Company.Id).subscribe(data => {
        this.workStatuFields = data;
      });
    }
    
  }
  
  viewClose(){
    this.dialogRef.close(true);
  }

  

  downloadResume(){

  }

  getAssignAddress(event) {
    let data = event.address_components
    this.currentApplicant.ApplicantLocation = "";
    this.currentApplicant.City = "";
    this.currentApplicant.State = "";
    if (data.length > 0) {
      for (let address of data) {
        if (address.types.includes("street_number")) {
          //this.onboardEmployeeAssignment.WLAddress1 = address.long_name;
        } else if (address.types.includes("route")) {
          //this.onboardEmployeeAssignment.WLAddress1 = isNullOrUndefined(this.onboardEmployeeAssignment.WLAddress1) ? "" : this.onboardEmployeeAssignment.WLAddress1 + " " + address.long_name;
        } else if ((address.types.includes("sublocality") || (address.types.includes("locality")))) {
          this.currentApplicant.City = address.long_name;
        } else if (address.types.includes("administrative_area_level_1")) {
          this.currentApplicant.State = address.short_name;
        } else if (address.types.includes("country")) {
          //this.benchCandidates.Country = address.short_name;
        } else if (address.types.includes("postal_code")) {
          //this.benchCandidates.Zip = address.long_name;
        }
      }
      this.currentApplicant.ApplicantLocation = this.currentApplicant.City + ', ' + this.currentApplicant.State;
    }

    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }
  inputAssignAddress(event) {
  }

  updateApplicant(){
    const isReference1Empty = Object.values(this.reference1).every(value => {
      if (!value) {
        return true;
      }
      return false;
    });

    const isReference2Empty = Object.values(this.reference2).every(value => {
      if (!value) {
        return true;
      }
      return false;
    });

    const isC2CEmpty = Object.values(this.c2creference).every(value => {
      if (!value) {
        return true;
      }
      return false;
    });

    if(isReference1Empty==false){
      this.reference1.RefType = "Refer1";
      this.reference1.ApplicantId=this.currentApplicant.ApplicantId;
      this.applicantsRefrences.push(this.reference1);
    }

    if(isReference2Empty==false){
      this.reference2.RefType = "Refer2";
      this.reference2.ApplicantId=this.currentApplicant.ApplicantId;
      this.applicantsRefrences.push(this.reference2);
    }

    if(isC2CEmpty==false){
      this.c2creference.RefType = "C2C";
      this.c2creference.ApplicantId=this.currentApplicant.ApplicantId;
      this.applicantsRefrences.push(this.c2creference);
    }
    
    this.currentApplicant.CompanyId=this.loginUser.Company.Id;
    this.currentApplicant.ApplicantRefereces = this.applicantsRefrences;

    if (this.selectedHashTagChips && this.selectedHashTagChips.length > 0)
      this.currentApplicant.HashTags = this.selectedHashTagChips.join(',');
    
    this.currentApplicant.CreatedDate=new Date(); 
    this.currentApplicant.RecruiterId=this.loginUser.UserId;
    this.currentApplicant.CompanyId=this.loginUser.Company.Id;
    this.currentApplicant.ApplicantSource = "Manual";
    //this.currentApplicant.ApplicantName = this.currentApplicant.FirstName +" "+this.currentApplicant.LastName; 
   
    this.jobCentralService.NewApplicant(this.currentApplicant).subscribe(response => {
      if (!response.IsError) {
        this._alertService.success(response.SuccessMessage);
        this.dialogRef.close(true);
      }
      else {
        this._alertService.error(response.ErrorMessage);
      }
    }, error => {
      this._alertService.error(error);
    })
  }

  clearFields(){

  }

  RemoveResume(applicant: ApplicantMaster) {
    // this._mrktService.RemoveCandidateResume(resumeBank.CandidateID).subscribe(response => {
    //   this._alertService.success("resume removed successfully");
    //   this.benchCandidates.Resume_Path_Bucket = null;
    //   this.benchCandidates.ResumePathType = null;
    //   this.benchCandidates.ResumePathKey = null;
    //   this.benchCandidates.UploadedFileName = null;
      
    // }, error => {
    //   this._alertService.error(error);
    // });
  }

  onChange(event) {
    this.fileUploadLoading = true;
    var target = event.target || event.srcElement; //if target isn't there then take srcElement
    let file = target.files;
    if (file && file.length === 0) {
      this._alertService.error('Please Upload a file to continue');
      return;
    }
    this.jobCentralService.UploadApplicantResume(file)
      .subscribe(response => {
        this.fileUploadResponse = response;
        this.currentApplicant.TempKey = this.fileUploadResponse.ActualFileName;
        this.currentApplicant.ViewResumeInnerPath = this.fileUploadResponse.DisplayFileName;
        this.currentApplicant.UploadedFileName = file[0].name;
        this.currentApplicant.TempFileSource = "New";
        this.currentApplicant.AttachedFileName = file[0].name;
        this.currentApplicant.DisplayFileName = this.fileUploadResponse.DisplayFileName;
        this.currentApplicant.ActualFileName = this.fileUploadResponse.ActualFileName;
        this.fileUploadLoading = false;
      },
        error => {
          this._alertService.error(error);
          this.fileUploadLoading = false;
        })

        if (!this.cdRef["distroyed"]) {
          this.cdRef.detectChanges();
        }
  }

  
  GetHashtags() {
    this.jobCentralService.getCRMHashTag(this.loginUser.Company.Id, 'ATS', 2)
      .subscribe(
        hashtags => {
          this.hashtags = hashtags;
          this.hashtags.forEach(item => {
            this.AllHashTags.push(item.HashTagText);
          });
        },
        error => this._alertService.error(error));

  }

  HashTagschangeSelected(parameter: string, query: string) {
    const index = this.selectedHashTagChips.indexOf(query);
    if (index >= 0) {
      this.selectedHashTagChips.splice(index, 1);
    } else {
      this.selectedHashTagChips.push(query);
    }
    console.log('this.selectedHashTagChips: ' + this.selectedHashTagChips);
  }

  contentLoaded() {
    document.getElementById("progressBar").style.display = "none";
  }

  onTabChanged(event: MatTabChangeEvent) {
    if (event.index === 0) {
      this.isSummary = true;
      this.isnotes = false;
    } else if (event.index === 1) {
      this.isSummary = false;
      this.isnotes = true;
    } 
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }

}
