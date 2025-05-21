import { ChangeDetectorRef, Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmitterService } from 'src/@cv/services/emitter.service';
import { FileUploadResponse, LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService, EventEmitterService, TimeZoneService } from 'src/@shared/services';
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
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import icPictureAsPdf from '@iconify/icons-ic/twotone-picture-as-pdf';
import icfileupload from '@iconify/icons-ic/file-upload';
import { Observable, Subject } from 'rxjs';
import { HashTag } from 'src/@shared/models/hashtags';
import { ApplicantMaster } from '../../core/model/applicantmaster';
import * as FileSaver from 'file-saver';
import icArrowDropDown from '@iconify/icons-ic/twotone-arrow-drop-down';
import icPersonAdd from '@iconify/icons-ic/twotone-person-add';
import icPerson from '@iconify/icons-ic/twotone-person';
import icShare from '@iconify/icons-ic/twotone-share';
import icratereview from '@iconify/icons-ic/twotone-rate-review';
import icsettings_backup_restore from '@iconify/icons-ic/twotone-settings-backup-restore';
import icDelete from '@iconify/icons-ic/twotone-delete';
import { ConfirmDialogModel, ConfirmDialogModelResponse } from 'src/@shared/models/confirmdialogmodel';
import { ConfirmDialogNotesComponent } from 'src/@shared/components/filter-components/confirm-dialog-notes/confirm-dialog-notes.component';
import { SelectItem } from 'src/@shared/models/common/selectitem';
import { AccountTypesEnum } from 'src/@cv/models/accounttypeenum';
import { AccountTypes } from 'src/static-data/accounttypes';
import icnote from '@iconify/icons-ic/note';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { JobboardResponses } from '../../core/model/jobboardresponses';
import { ShareApplicantComponent } from '../../JC-Common/share-applicant/share-applicant.component';
import { AssignMyselfComponent } from '../../JC-Common/assign-myself/assign-myself.component';
import { ApplicantAssignComponent } from '../../JC-Common/applicant-assign/applicant-assign.component';
import { RecruiterMappings } from '../../core/model/applicantrecruitermapping';
import { ManagerEditStatusLabels } from 'src/static-data/aio-table-data';
import { MatSelectChange } from '@angular/material/select';
import icEdit from '@iconify/icons-ic/twotone-edit';
import { ApplicantCandidateComponent } from '../../JC-Common/applicant-candidate/applicant-candidate.component';
import { CandidateAccount } from   'src/@shared/core/ats/models/candidateaccount';
import { ApplicantIgnoreComponent } from '../../JC-Common/applicant-ignore/applicant-ignore.component';
import { ArchiveShareComponent } from '../archive-share/archive-share.component';
import { ArchiveAssignComponent } from '../archive-assign/archive-assign.component';
import { WorkStatusService } from 'src/@shared/http/work-status.service';

@Component({
  selector: 'cv-archive-view',
  templateUrl: './archive-view.component.html',
  styleUrls: ['./archive-view.component.scss'],
  animations: [
    fadeInUp400ms,
  ],
  providers: [AccountTypes]
})
export class ArchiveViewComponent implements OnInit {

  loginUser: LoginUser;
  SelectedCandidate: BenchCandidate;
  currentApplicant: JobboardResponses = new JobboardResponses();
  applicantsRefrences: ApplicantReferences[] = [];
  iclocationon = iclocationon;
  icPictureAsPdf = icPictureAsPdf;
  icfileupload = icfileupload;
  fileUploadLoading: boolean = false;
  fileUploadResponse: FileUploadResponse;
  keywordsText: string[];
  CertificationsText: string[];
  AssignToNames: string[] = [];
  index: number = 0;
  Default: string = "true";
  icInfo = icInfo;
  icBook = icBook;
  icEye = icEye;
  icClose = icClose;
  icnote = icnote;
  icsettings_backup_restore = icsettings_backup_restore;
  icDelete = icDelete;
  icDownload: string;
  status_textClass: any = 'text-amber-contrast';
  status_bgClass: any = 'bg-amber';
  AssigneName: string = null;
  ReviweAssigneeCtrl: FormControl = new FormControl();
  addForm: FormGroup;
  icArrowDropDown = icArrowDropDown;
  icPersonAdd = icPersonAdd;
  icPerson = icPerson;
  icShare = icShare;
  icratereview = icratereview;
  ref1FromGroup: FormGroup;
  ref2FromGroup: FormGroup;
  c2cFromGroup: FormGroup;
  reference1: ApplicantReferences = new ApplicantReferences();
  reference2: ApplicantReferences = new ApplicantReferences();
  c2creference: ApplicantReferences = new ApplicantReferences();
  cansubVClientAccount: CandidateAccount = new CandidateAccount();
  hashtags: HashTag[];
  HashTagCtrl = new FormControl();
  AllHashTags: string[] = [];
  filteredHashTags: Observable<any[]>;
  selectedHashTagChips: any[] = [];
  SelectedHashTags: any;
  DialogResponse: ConfirmDialogModelResponse;
  chipsControl = new FormControl();
  chipsControlValue$ = this.chipsControl.valueChanges;
  unsubscribe$: Subject<void> = new Subject<void>();
  workStatusFields: SelectItem[] = [];
  enumAccountTypes: typeof AccountTypesEnum = AccountTypesEnum;
  isSummary: boolean = false;
  isnotes: boolean = false;
  datemask = [/\d/, /\d/, '/', /\d/, /\d/];
  applicantsMapping: RecruiterMappings[] = [];
  statusLabels = ManagerEditStatusLabels;
  icEdit = icEdit;
  IsAssigneeToMySelf: boolean;
  IsPageDirty:boolean=false;
  constructor(@Inject(MAT_DIALOG_DATA) public def_inboxId: any,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ArchiveViewComponent>,
    private _authService: AuthenticationService,
    private jobCentralService: JobCentralService,
    private _alertService: AlertService,
    private cdRef: ChangeDetectorRef,
    private matIconRegistry: MatIconRegistry,
    private domSanitzer: DomSanitizer,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private accountTypes: AccountTypes,
    private _eventemtterservice: EventEmitterService,
    private workStatusService: WorkStatusService
  ) {
    this.icDownload = iconsIC.find(iconName => iconName == "font_download");
    this.SelectedCandidate = new BenchCandidate();
    this.matIconRegistry.addSvgIcon(
      'linkedin',
      this.domSanitzer.bypassSecurityTrustResourceUrl('assets/img/demo/rounded_linkedin.svg')
    );
    this.matIconRegistry.addSvgIcon('half-star', this.domSanitzer.bypassSecurityTrustResourceUrl('assets/icons/half-star.svg'));
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
      SSN: [null],
      phone: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      LinkedIn: [null],
      ApplicantLocation: [null],
      Notes: [null],
      workCategory: [],
      PayRate: [null],
      c2cfirstName: [null],
      c2clastName: [null],
      c2cphonenumber: [null],
      c2cemail: [null],
      jobtitle: [null],
      wpermit: [null],
      SkillRating: [null],
      CommRating: [null]
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
      EmitterService.get("JobCentral").emit("JobCentral");
      this.isSummary = true;
      this.GetHashtags();

      this.loadWorkStatusFields().subscribe({
        next: (workStatusFields) => {
          this.workStatusFields = workStatusFields;
          if (!this.cdRef["distroyed"]) {
            this.cdRef.detectChanges();
          }
        },
        error: (error) => {
          console.error('Error loading work status fields:', error);
          this._alertService.error('Error loading work status fields');
        }
      });
      if(this.def_inboxId.ResponseId > 0){
        this.GetApplicantDetails(this.loginUser.Company.Id, this.def_inboxId.ResponseId);
      }
    }
  }

  loadWorkStatusFields() {
    return this.workStatusService.getWorkStatusFields(this.loginUser.Company.Id);
  }



  GetApplicantDetails(companyId: number, applicantId: number) {
    this.jobCentralService.ViewArchieveResponseDetails(companyId, applicantId).subscribe(result => {
      if (result.IsError) {
        this._alertService.error(result.ErrorMessage);
      } else {
        this.currentApplicant = result.Data;
        if (this.currentApplicant.HashTags) {
          let ids: string[] = this.currentApplicant.HashTags.split(',');
          ids.forEach(element => {
            let hastagitem = this.hashtags.find(x => x.HashTagId == Number(element));
            hastagitem.state = true;
            this.selectedHashTagChips.push(hastagitem.HashTagId);
          });
          this.selectedHashTagChips = this.currentApplicant.HashTags.split(',');
        }
        else
          this.selectedHashTagChips = [];

        if (this.currentApplicant.ApplicantRefereces.length > 0) {
          this.currentApplicant.ApplicantRefereces.forEach(item => {
            if (item.RefType == "Refer1") {
              this.reference1 = item;
            } else if (item.RefType == "Refer2") {
              this.reference2 = item;
            }
            else if (item.RefType == "C2C") {
              debugger;
              this.cansubVClientAccount = this.PrepareAccountFromRefrence(item);
              this.c2creference = item;
            }
          })
        }

        if (this.currentApplicant.RecruiterList != null) {
          if (this.currentApplicant.RecruiterList.find(x => x.UserId == this.loginUser.UserId)) {
            this.IsAssigneeToMySelf = true;
          } else
            this.IsAssigneeToMySelf = false;
        }
        else {
          this.IsAssigneeToMySelf = false;
        }

      }
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    }, error => {
      this._alertService.error(error);
    });
  }

  viewClose() {
    this.dialogRef.close(true);
  }

  downloadResume() {
    this.jobCentralService.DownloadInboxResume(this.currentApplicant.CompanyId, this.currentApplicant.ResponseId)
      .subscribe(response => {
        let filename = this.currentApplicant.AttachedFileName;
        FileSaver.saveAs(response, filename);
      },
        error => {
          this._alertService.error("Error while downloading the file.");
        })
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
    this.IsPageDirty = true;
    if (!this.cd["distroyed"]) {
      this.cd.detectChanges();
    }
  }
  inputAssignAddress(event) {
  }

  updateApplicant() {
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

    if (this.currentApplicant.EmploymentType == "C2C") {
      debugger;
      if (this.cansubVClientAccount.AccountID > 0) {
        this.cansubVClientAccount.MappingStatus = true;
        this.cansubVClientAccount.CompanyID = this.loginUser.Company.Id;
        const account = this.DeepCopyForObject(this.cansubVClientAccount);
        const c2creference = this.DeepCopyForObject(this.c2creference);
        c2creference.ApplicantId = this.currentApplicant.ResponseId;
        c2creference.RefType = "C2C";
        c2creference.Company = account.AccountName;
        c2creference.FirstName = account.SalesPOC.FirstName;
        c2creference.LastName = account.SalesPOC.LastName;
        c2creference.Email = account.SalesPOC.Email;
        c2creference.PhoneNumber = account.SalesPOC.Phonenumber;
        c2creference.AccountId = account.AccountID;
        c2creference.ContactId = account.SalesPOC.ContactID;
        this.applicantsRefrences.push(c2creference);

      } else if (this.cansubVClientAccount.AccountID == 0 && !isNullOrUndefined(this.cansubVClientAccount.AccountName) && this.cansubVClientAccount.AccountName != '') {
        const prearedacnt = this.prepareAccount(this.enumAccountTypes.SubVendor, this.cansubVClientAccount)
        let account = this.DeepCopyForObject(prearedacnt);
        const c2creference = this.DeepCopyForObject(this.c2creference);
        c2creference.ApplicantId = this.currentApplicant.ResponseId;
        c2creference.RefType = "C2C";
        c2creference.Company = account.AccountName;
        c2creference.FirstName = account.SalesPOC.FirstName;
        c2creference.LastName = account.SalesPOC.LastName;
        c2creference.Email = account.SalesPOC.Email;
        c2creference.PhoneNumber = account.SalesPOC.Phonenumber;
        c2creference.AccountId = account.AccountID;
        c2creference.ContactId = account.SalesPOC.ContactID;
        this.applicantsRefrences.push(c2creference);

      }
    }


    if (isReference1Empty == false) {
      this.reference1.RefType = "Refer1";
      this.reference1.ApplicantId = this.currentApplicant.ResponseId;
      this.applicantsRefrences.push(this.reference1);
    }

    if (isReference2Empty == false) {
      this.reference2.RefType = "Refer2";
      this.reference2.ApplicantId = this.currentApplicant.ResponseId;
      this.applicantsRefrences.push(this.reference2);
    }

    this.currentApplicant.CompanyId = this.loginUser.Company.Id;
    this.currentApplicant.ApplicantRefereces = this.applicantsRefrences;

    if (this.selectedHashTagChips && this.selectedHashTagChips.length > 0)
      this.currentApplicant.HashTags = this.selectedHashTagChips.join(',');

    this.currentApplicant.IsCandidateViewed = true;
    this.currentApplicant.UpdatedBy = this.loginUser.UserId;
    if(this.def_inboxId.ResponseId > 0){
      this.UpdateApplicant();
    }
    else{
      this.SaveNewApplicant();
    }

  }

  UpdateApplicant(){
    this.jobCentralService.UpdateInboxResponse(this.currentApplicant).subscribe(response => {
      if (!response.IsError) {
        this._alertService.success(response.SuccessMessage);
        this.ResetForm();

        if (this.def_inboxId.Source == 'LinkedIn')
          this._eventemtterservice.linkedinResponseEvent.emit();
        else if (this.def_inboxId.Source == 'Dice')
          this._eventemtterservice.DiceResponseEvent.emit();
        else if (this.def_inboxId.Source == 'ACP')
          this._eventemtterservice.OtherSourceResponseEvent.emit();
        else if (this.def_inboxId.Source == 'Ignored')
          this._eventemtterservice.IgnoredResponsesEvent.emit();
        else if (this.def_inboxId.Source == 'Monster')
          this._eventemtterservice.MonsterResponseEvent.emit();
      }
      else {
        this._alertService.error(response.ErrorMessage);
      }
    }, error => {
      this._alertService.error(error);
    })
  }

  SaveNewApplicant(){
    this.currentApplicant.CreatedDate=new Date();
    this.currentApplicant.ActualDate=new Date(); 
    this.currentApplicant.AssignedDate = new Date();
    this.currentApplicant.CreatedBy = this.loginUser.UserId;
    this.currentApplicant.RecruiterId=this.loginUser.UserId;
    this.currentApplicant.CompanyId=this.loginUser.Company.Id;
    this.currentApplicant.ApplicantSource = "Manual";
    this.jobCentralService.NewApplicant(this.currentApplicant).subscribe(response => {
      if (!response.IsError) {
        this._alertService.success(response.SuccessMessage);

        if (this.def_inboxId.Source == 'LinkedIn')
          this._eventemtterservice.linkedinResponseEvent.emit();
        else if (this.def_inboxId.Source == 'Dice')
          this._eventemtterservice.DiceResponseEvent.emit();
        else if (this.def_inboxId.Source == 'ACP')
          this._eventemtterservice.OtherSourceResponseEvent.emit();
        else if (this.def_inboxId.Source == 'Ignored')
          this._eventemtterservice.IgnoredResponsesEvent.emit();
        else if (this.def_inboxId.Source == 'Monster')
          this._eventemtterservice.MonsterResponseEvent.emit();

          this.dialogRef.close();
      }
      else {
        this._alertService.error(response.ErrorMessage);
      }
    }, error => {
      this._alertService.error(error);
    })
  }

  clearFields() {

    this.GetApplicantDetails(this.loginUser.Company.Id, this.def_inboxId.ResponseId);
    this.addForm.markAsPristine();
  }

  ResetForm() {
    this.currentApplicant = new JobboardResponses();
    this.reference1 = new ApplicantReferences();
    this.reference2 = new ApplicantReferences();
    this.c2creference = new ApplicantReferences();
    this.cansubVClientAccount = new CandidateAccount();
    this.applicantsRefrences = [];
    this.addForm.markAsPristine();

    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }

    this.ngOnInit();

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
        this.UpdateNewResumeToAplicant();
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

  UpdateNewResumeToAplicant() {
    this.jobCentralService.UpdateApplicantResume(this.currentApplicant)
      .subscribe(response => {
        if (!response.IsError) {
          this._alertService.success(response.SuccessMessage);
          this.GetApplicantDetails(this.loginUser.Company.Id, this.def_inboxId.ResponseId);
        }
        else {
          this._alertService.error(response.ErrorMessage);
        }
      },
        error => {
          this._alertService.error(error);

        })
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
    this.IsPageDirty=true;
  }

  contentLoaded() {
    document.getElementById("progressBar").style.display = "none";
  }

  onTabChanged(event: MatTabChangeEvent) {
    debugger;
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


  ShareApplcant() {
    this.dialog.open(ArchiveShareComponent, {
      data: { resourceId: this.currentApplicant.ArchiveId, resourceType: 'Applicant' }, width: '60%', disableClose: true
    }).afterClosed().subscribe(response => {

      if (response) {
      }
    });
  }

  AssignApplcant() {
    this.dialog.open(ArchiveAssignComponent, {
      data: { responses: null, model: 'single', responseId: this.currentApplicant.ArchiveId }, width: '60%', height: '70vh', disableClose: true
    }).afterClosed().subscribe(response => {
      if (response) {

        if (this.def_inboxId.Source == 'LinkedIn')
          this._eventemtterservice.linkedinResponseEvent.emit();
        else if (this.def_inboxId.Source == 'Dice')
          this._eventemtterservice.DiceResponseEvent.emit();
        else if (this.def_inboxId.Source == 'ACP')
          this._eventemtterservice.OtherSourceResponseEvent.emit();
        else if (this.def_inboxId.Source == 'Ignored')
          this._eventemtterservice.IgnoredResponsesEvent.emit();
        else if (this.def_inboxId.Source == 'Monster')
          this._eventemtterservice.MonsterResponseEvent.emit();
      }
    });
  }

  ReviewApplcant() {
    this.dialog.open(AssignMyselfComponent, {
      data: {resourceId:this.currentApplicant.ArchiveId,resourceType: 'Archeive'},
      maxWidth: '95vw', width: '95vw', disableClose: true
    }).afterClosed().subscribe(response => {

      if (response) {
        if (this.def_inboxId.Source == 'LinkedIn')
          this._eventemtterservice.linkedinResponseEvent.emit();
        else if (this.def_inboxId.Source == 'Dice')
          this._eventemtterservice.DiceResponseEvent.emit();
        else if (this.def_inboxId.Source == 'ACP')
          this._eventemtterservice.OtherSourceResponseEvent.emit();
        else if (this.def_inboxId.Source == 'Ignored')
          this._eventemtterservice.IgnoredResponsesEvent.emit();
        else if (this.def_inboxId.Source == 'Monster')
          this._eventemtterservice.MonsterResponseEvent.emit();
      }
    });
  }


  

  onLabelChange(change: MatSelectChange) {
    var selectedStatus = change.value;
    this.currentApplicant.ApplicantStatusName = selectedStatus.text;
    this.currentApplicant.ApplicantStatus = selectedStatus.StatusId;
    const Psubmission = {
      ApplicantId: this.currentApplicant.ResponseId,
      companyId: this.loginUser.Company.Id,
      ApplicantStatus: selectedStatus.StatusId,
      UpdatedBy: this.loginUser.UserId
    };
    this.jobCentralService.UpdateApplicantStatus(Psubmission)
      .subscribe(
        response => {
          if (response.IsError == false) {
            this._alertService.success(response.SuccessMessage);

            if (this.def_inboxId.Source == 'LinkedIn')
              this._eventemtterservice.linkedinResponseEvent.emit();
            else if (this.def_inboxId.Source == 'Dice')
              this._eventemtterservice.DiceResponseEvent.emit();
            else if (this.def_inboxId.Source == 'ACP')
              this._eventemtterservice.OtherSourceResponseEvent.emit();
            else if (this.def_inboxId.Source == 'Ignored')
              this._eventemtterservice.IgnoredResponsesEvent.emit();
            else if (this.def_inboxId.Source == 'Monster')
              this._eventemtterservice.MonsterResponseEvent.emit();

          }
        },
        error => {
          this._alertService.error(error);
        }
      );
  }

 

  BackToInbox() {
    const message = 'Applicant ' + this.currentApplicant.FirstName + " " + this.currentApplicant.LastName + ' will be moved to Inbox? Please provide a reason.'
    const dialogData = new ConfirmDialogModel("Back To Inbox", message);
    const dialogRef = this.dialog.open(ConfirmDialogNotesComponent, {
      width: '60%',
      data: dialogData,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      this.DialogResponse = dialogResult;
      if (this.DialogResponse.Dialogaction == true) {
        this.ConfirmBackToInbox(this.currentApplicant, this.DialogResponse.Notes);
      }
    });
  }

  ConfirmBackToInbox(applicant: JobboardResponses, DeleteNotes: string) {
    if (applicant.ResponseId > 0) {
      const pfilters = {
        InboxId: applicant.ResponseId,
        applicantId: 0,
        companyId: this.loginUser.Company.Id,
        updatedby: this.loginUser.UserId,
        notes: DeleteNotes,
        RecruiterId: this.loginUser.UserId
      };
      this.jobCentralService.ApplicantBackToInbox(pfilters).subscribe(response => {
        if (response.IsError == false) {
          this._alertService.success("Applicant Successfully Moved to Inbox");

          if (this.def_inboxId.Source == 'LinkedIn')
            this._eventemtterservice.linkedinResponseEvent.emit();
          else if (this.def_inboxId.Source == 'Dice')
            this._eventemtterservice.DiceResponseEvent.emit();
          else if (this.def_inboxId.Source == 'ACP')
            this._eventemtterservice.OtherSourceResponseEvent.emit();
          else if (this.def_inboxId.Source == 'Ignored')
            this._eventemtterservice.IgnoredResponsesEvent.emit();
          else if (this.def_inboxId.Source == 'Monster')
            this._eventemtterservice.MonsterResponseEvent.emit();

          this.dialogRef.close();

        }
      },
        error => {
          this._alertService.error(error);
        })
    }
  }

  GetCandSubVendorData(event) {
    this.cansubVClientAccount = event;
    this.IsPageDirty=true;
  }

  GetTechRating(event){
    this.currentApplicant.TechnicalSkillRating = event.toString();
    this.IsPageDirty=true;
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }

  GetCommRating(event){
    this.currentApplicant.CommunicationSkillRating = event.toString();
    this.IsPageDirty=true;
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }

  DeepCopyForObject(source) {
    return JSON.parse(JSON.stringify(source));
  }

  prepareAccount(AccountType, acunt: CandidateAccount) {
    let Account: CandidateAccount = new CandidateAccount();
    Account = acunt;
    Account.CreatedBy = this.loginUser.UserId;
    Account.CreatedDate = new Date();
    Account.AccountTypeID = AccountType;
    Account.Employer = false;
    Account.AccountLevel = "candidate";
    Account.MappingStatus = true;
    Account.CompanyID = this.loginUser.Company.Id;
    Account.AccountTypeName = this.accountTypes.CandidateC2C.find(x => x.value == AccountType).label;
    if (AccountType === this.enumAccountTypes.EndClient) {
      Account.SalesPOC = null;
    } else {
      Account.SalesPOC.CreatedBy = this.loginUser.UserId;
      Account.SalesPOC.CreatedDate = new Date();
      Account.SalesPOC.FirstName = acunt.SalesPOC.FirstName;
      Account.SalesPOC.LastName = acunt.SalesPOC.LastName;
      Account.SalesPOC.Email = acunt.SalesPOC.Email;
      Account.SalesPOC.Phonenumber = acunt.SalesPOC.Phonenumber;
    }
    return Account;
  }

  PrepareAccountFromRefrence(c2cref: ApplicantReferences) {
    let Account: CandidateAccount = new CandidateAccount();
    Account.AccountID = c2cref.AccountId;
    Account.AccountName = c2cref.Company;
    Account.AccountLevel = "candidate";
    Account.MappingStatus = true;
    Account.CreatedBy = this.loginUser.UserId;
    Account.CreatedDate = new Date();
    Account.CompanyID = this.loginUser.Company.Id;
    Account.AccountTypeName = this.accountTypes.CandidateC2C.find(x => x.value == 7).label;
    Account.SalesPOC.CreatedBy = this.loginUser.UserId;
    Account.SalesPOC.CreatedDate = new Date();
    Account.SalesPOC.FirstName = c2cref.FirstName;
    Account.SalesPOC.LastName = c2cref.LastName;
    Account.SalesPOC.Email = c2cref.Email;
    Account.SalesPOC.Phonenumber = c2cref.PhoneNumber;
    return Account;
  }

  


}
