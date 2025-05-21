import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { TCSettingsService } from '../../core/http/tcsettings.service';
import { BenchAccountTypes, HashTags, keywords, ResumeSource } from '../../core/models/settingsmodels';
import icClose from '@iconify/icons-ic/twotone-close';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { ValidationService } from 'src/@cv/services/validation.service';
import { InterviewStatus } from '../../core/models/Interviewstatuslist';
import { MaterSubmissionStatus } from '../../core/models/matersubmissionstatus';
import { AccountTypes } from 'src/static-data/accounttypes';

@Component({
  selector: 'cv-add-ats-settings',
  templateUrl: './add-ats-settings.component.html',
  styleUrls: ['./add-ats-settings.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
  providers: [AccountTypes,AuthenticationService, TCSettingsService,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'standard'
      } as MatFormFieldDefaultOptions
    }
  ]
})
export class AddAtsSettingsComponent implements OnInit {
  icClose = icClose;
  public resumeSource: ResumeSource = new ResumeSource();
  loginUser: LoginUser;
  public resumeSourceForm: FormGroup;
  hashtagform: FormGroup;
  public hashTags: HashTags = new HashTags();
  accountTypes: BenchAccountTypes = new BenchAccountTypes();
  public accountTypeForm: FormGroup;
  public interviewForm: FormGroup;
  public SubmissionStatusForm: FormGroup;
  keywordForm: FormGroup;
  public interviewStatus: InterviewStatus = new InterviewStatus();
  public submissonStatus: MaterSubmissionStatus = new MaterSubmissionStatus();
  public keyword: keywords = new keywords();
  IsIntvLoading: boolean = false;
  IsSubLoading: boolean = false;
  IsHashTagLoading: boolean = false;
  IsKeywordsLoading: boolean = false;
  IsResumeSrcLoading:boolean=false;
  StatusColorCodes=[];
  selectedIntvStatusColor:string;
  
  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public Data: any,
    private dialogRef: MatDialogRef<AddAtsSettingsComponent>,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private cdRef: ChangeDetectorRef,
    private service: TCSettingsService,
    private staticDataTypes: AccountTypes,
    private _formBuilder: FormBuilder
  ) {
    this.resumeSourceForm = this._formBuilder.group({
      'SourceName': ['', [Validators.required]]
    });
    this.hashtagform = this._formBuilder.group({
      'HashTagText': ['', [Validators.required, ValidationService.commaValidator]],
      'Category': ['']
    });
    this.accountTypeForm = this._formBuilder.group({
      'AccountTypeName': ['', [Validators.required]]
    });
    this.interviewForm = this._formBuilder.group({
      'InterviewStatusName': ['', [Validators.required]],
      'InterviewColorCode':['', [Validators.required]],
    });
    this.SubmissionStatusForm = this._formBuilder.group({
      'StatusName': ['', [Validators.required]],
      'Submissioncolorcode':['', [Validators.required]],
    });
    this.keywordForm = this._formBuilder.group({
      'keyword': ['', [Validators.required]]
    });
    this.StatusColorCodes = this.staticDataTypes.StatusColorList;
  }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.Data && this.Data.source != 0 && this.Data.type === "ResumeSource") {
      this.resumeSource = this.Data.source;
    } else if (this.Data && this.Data.source != 0 && this.Data.type === "Hashtag") {
      this.hashTags = this.Data.source;
    } else if (this.Data && this.Data.source != 0 && this.Data.type === "Interview") {
      this.interviewStatus = this.Data.source;
    } else if (this.Data && this.Data.source != 0 && this.Data.type === "SubmissionStatus") {
      this.submissonStatus = this.Data.source;
    } else if (this.Data && this.Data.source != 0 && this.Data.type === "AccountType") {
      this.accountTypes = this.Data.source;
    } else if (this.Data && this.Data.source != 0 && this.Data.type === "Keyword") {
      this.keyword = this.Data.source;
    }
  }
  addResumeSource() {
    this.IsResumeSrcLoading=true;
    if (this.resumeSource && this.resumeSource.SourceId > 0) {
      this.resumeSource.UpdatedBy = this.loginUser.UserId;
      this.resumeSource.UpdatedDate = new Date();
    } else {
      this.resumeSource.CompanyId = this.loginUser.Company.Id;
      this.resumeSource.CreatedBy = this.loginUser.UserId;
    }
    this.service.AddResumeSource(this.resumeSource, this.loginUser.UserId)
      .subscribe(
        response => {
          this.IsResumeSrcLoading=false;
          this.resumeSourceForm.reset();
          this.dialogRef.close(true);
        },
        error => {
          this.IsResumeSrcLoading=false;
          this._alertService.error(error);
        });
  }
  Save() {
    this.IsHashTagLoading = true;
    if (this.hashTags && this.hashTags.HashTagId > 0) {
      this.hashTags.UpdatedDate = new Date();
    } else {
      this.hashTags.CreatedBy = this.loginUser.UserId;
    }
    this.hashTags.HashTagSource = this.loginUser.Company.Id.toString();
    this.hashTags.ModuleType = 'ATS';
    this.service.addHashTag(this.hashTags).subscribe(hashtag => {
      this.IsHashTagLoading = false;
      this.hashtagform.reset();
      this.dialogRef.close(true);
    }, error => { this.IsHashTagLoading = false; this._alertService.success(error); });
  }
  ChangeHashTag(HashTag: any) {
    this.hashTags.Category = HashTag.value;
  }
  addAccountTypeName() {
    if (this.accountTypes.AccountTypeName == null || this.accountTypes.AccountTypeName.trim() == '') {
      this._alertService.error("Please Enter Account type.");
      return;
    }
    if (this.accountTypes.Id > 0) {
      this.accountTypes.UpdatedBy = this.loginUser.UserId;
      this.accountTypes.UpdatedDate = new Date();
    }
    else {
      this.accountTypes.CreatedBy = this.loginUser.UserId;
      this.accountTypes.CompanyId = this.loginUser.Company.Id;
      this.accountTypes.IsActive = true;
    }

    this.service.AddBenchAccountTypes(this.accountTypes)
      .subscribe(
        response => {
          if (response.Data.DBStatus != "Account Type Already Exists") {
            this.hashtagform.reset();
            this.dialogRef.close(true);
          }
          else {
            this._alertService.error(response.Data.DBStatus)
          }
        },
        error => {
          this._alertService.error(error);
        }
      );

  }
  addinterviewStatus() {
    this.IsIntvLoading = true;
    if (this.interviewStatus && this.interviewStatus.Id > 0) {
      this.interviewStatus.UpdatedDate = new Date();
      this.interviewStatus.UpdatedBy = this.loginUser.UserId;
      this.interviewStatus.CompanyId = this.loginUser.Company.Id;
    } else {
      this.interviewStatus.CompanyId = this.loginUser.Company.Id;
      this.interviewStatus.CreatedBy = this.loginUser.UserId;
      this.interviewStatus.CreatedDate = new Date();
      this.interviewStatus.IsActive = true;
    }
    this.service.AddInterviewStatus(this.interviewStatus).subscribe(response => {
      if (response.IsError == true) {
        this.IsIntvLoading = false;
        this._alertService.error(response.ErrorMessage);
      }
      else {
        this._alertService.success(response.SuccessMessage);
        this.IsIntvLoading = false;
        this.interviewForm.reset();
        this.dialogRef.close(true);
      }
    }, error => { this.IsIntvLoading = false; this._alertService.error(error); });
  }
  SaveSubmissionStatus() {
    this.IsSubLoading = true;
    if (this.submissonStatus.StatusName == null || this.submissonStatus.StatusName.trim() == '') {
      this._alertService.error("Please Enter Account type.");
      this.IsSubLoading = false;
      return;
    }
    if (this.submissonStatus.StatusId > 0)
      this.submissonStatus.UpdatedBy = this.loginUser.UserId;
    else
      this.submissonStatus.CreatedBy = this.loginUser.UserId;
    this.submissonStatus.CompanyId = this.loginUser.Company.Id;
    this.service.AddMasterSubmissionStatus(this.submissonStatus)
      .subscribe(
        response => {
          if (response.IsError == true) {
            this._alertService.error(response.ErrorMessage);
          }
          else {
            this._alertService.success(response.SuccessMessage);
            this.IsSubLoading = false;
            this.interviewForm.reset();
            this.dialogRef.close(true);
          }
        },
        error => {
          this.IsSubLoading = false;
          this._alertService.error(error);
        }
      );
  }
  saveKeywords() {
    if (!this.keyword.KeywordsText.trim()) {
      this._alertService.error('Please atleast one character to save');
      return;
    }
    this.keyword.KeywordsSource = this.loginUser.Company.Id.toString();
    this.service.SaveKeywords(this.keyword)
      .subscribe(response => {
        this.interviewForm.reset();
        this.dialogRef.close(true);
      }, error => {
        this._alertService.error(error);
      });

  }

  onIntvColorChange(event:any){
   let selectedStatus = this.StatusColorCodes.find(x=>x.label == event.value);
   if(selectedStatus){
    this.interviewStatus.bgclass = selectedStatus.bgclass;
   }
  }

  onSubmissionColorChange(event:any){
    let selectedStatus = this.StatusColorCodes.find(x=>x.label == event.value);
    if(selectedStatus){
     this.submissonStatus.bgclass = selectedStatus.bgclass;
    }
   }

 
}
