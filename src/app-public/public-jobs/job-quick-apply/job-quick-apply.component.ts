import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from 'src/@cv/services/validation.service';
import { FileUploadResponse } from 'src/@shared/models/fileuploadresponse';
import { SelectItem } from 'src/@shared/models/common/selectitem';
import { AccountTypes } from 'src/static-data/accounttypes';
import icClose from '@iconify/icons-ic/twotone-close';
import icAttachFile from '@iconify/icons-ic/twotone-attach-file';
import icAdd from '@iconify/icons-ic/twotone-add';
import icFileUpload from '@iconify/icons-ic/twotone-file-upload';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { CommonService } from 'src/@shared/http/common.service'; 
import { JobQuickApply } from 'src/app-public/modules/initial/core/models/job-apply';
import { WorkStatusService } from 'src/@shared/http/work-status.service';
import { LoginUser } from 'src/@shared/models';

@Component({
  selector: 'cv-job-quick-apply',
  templateUrl: './job-quick-apply.component.html',
  styleUrls: ['./job-quick-apply.component.scss'],
  providers: [AccountTypes]
})
export class JobQuickApplyComponent implements OnInit {

  loginUser: LoginUser;
  addCandidateForm: FormGroup;
  @ViewChild('fileInput') fileInput: any;
  fileUploadResponse: FileUploadResponse;
  loading: boolean = false;
  currentApplicant: JobQuickApply = new JobQuickApply();
  workStatuFields: SelectItem[] = [];
  icClose = icClose;
  icAttachFile = icAttachFile;
  icAdd = icAdd;
  icFileUpload = icFileUpload;
  companyId: number = 0;
  publishJobId: string;
  adressType: string = '(cities)';
  @ViewChild('addresstext') addresstext: any;
  autocompleteInput: string;
  IsFileLoading: boolean = false;
  formSubmitted: boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public InputData: any,
    private dialogRef: MatDialogRef<JobQuickApplyComponent>,
    private formBuilder: FormBuilder,
    private accountTypes: AccountTypes,
    private cd: ChangeDetectorRef,
    private _alertService: AlertService,
    private _commonService: CommonService,
    private workStatusService: WorkStatusService,
    private _authService: AuthenticationService) {
    this.addCandidateForm = this.formBuilder.group({
      'First_Name': ['', [Validators.required, ValidationService.onlyAlphabetswithDotValidator]],
      'Last_Name': ['', [Validators.required, ValidationService.onlyAlphabetswithDotValidator]],
      'Email': ['', [Validators.required, ValidationService.emailValidator]],
      'Primary_Phone_Number': ['', [Validators.required, ValidationService.phonenumValidator]],
      'LinkedIn': ['', [Validators.required, ValidationService.LinkedIn_urlValidator]],
      'wpermit': ['', [Validators.required]],
      'applicantLocation': ['', Validators.required],
      'resume': ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.companyId = Number(this.InputData.CompanyId);
      this.publishJobId = this.InputData.JobId;
      this.workStatusService.getWorkStatusFields(this.loginUser.Company.Id).subscribe(data => {
        this.workStatuFields = data;
      });
    }
  }

  OnApply() {
    this.formSubmitted = true;
    if (this.addCandidateForm.valid) {
      this.currentApplicant.CompanyId = this.companyId;
      this.currentApplicant.PublishedJobId = this.publishJobId;
      this._commonService.SaveApplicantFromJobPosting(this.currentApplicant)
        .subscribe(response => {
          if (!response.IsError) {
            this.dialogRef.close(true);
          }
          else {
            this._alertService.error(response.ErrorMessage);
          }
        },
          error => {
            this._alertService.error(error);

          })

    } else {
      this.markFormGroupTouched(this.addCandidateForm);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  removeResume() {

  }

  onChange(event) {
    this.IsFileLoading = true;
    //this.fileUploadLoading = true;
    if (this.currentApplicant.AttachedFilePath) {
      this.clearDocument();
    }
    var target = event.target || event.srcElement; //if target isn't there then take srcElement
    let file = target.files;
    if (file && file.length === 0) {
      this._alertService.error('Please Upload a file to continue');
      return;
    }
    this._commonService.UploadApplicantResume(file)
      .subscribe(response => {
        this.currentApplicant.ActualFileName = response.ActualFileName;
        this.currentApplicant.AttachedFilePath = response.AttachedFilePath;
        this.currentApplicant.AttachedFileName = response.AttachedFileName;
        this.addCandidateForm.patchValue({ resume: file });
        setTimeout(() => {
          this.IsFileLoading = false;
          // Trigger change detection
          this.cd.detectChanges();
        }, 5000);
      },
        error => {
          this._alertService.error(error);
          this.IsFileLoading = false;
        })
  }

  getAssignAddress(event) {
    let data = event.address_components
    this.currentApplicant.ApplicantLocation = "";
    this.currentApplicant.City = "";
    this.currentApplicant.State = "";

    if (data && data.length > 0) {
      for (let address of data) {
        if ((address.types.includes("sublocality") || (address.types.includes("locality")))) {
          this.currentApplicant.City = address.long_name;
        }
        else if (address.types.includes("administrative_area_level_1")) {
          this.currentApplicant.State = address.short_name;
        }
      }
      this.currentApplicant.ApplicantLocation = this.currentApplicant.City + ', ' + this.currentApplicant.State;
    }
    else {
      this.currentApplicant.ApplicantLocation = null;
    }
    if (!this.cd["distroyed"]) {
      this.cd.detectChanges();
    }
  }

  inputAssignAddress(event) {
    this.getAssignAddress(event.target.value);
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  ngAfterViewInit() {
    this.getPlaceAutocomplete();
  }

  private getPlaceAutocomplete() {
    const autocomplete = new google.maps.places.Autocomplete(this.addresstext.nativeElement,
      {
        componentRestrictions: { country: 'US' },
        types: [this.adressType]  // 'establishment' / 'address' / 'geocode'
      });
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      const place = autocomplete.getPlace();
      this.getAssignAddress(place);
      //this.invokeEvent(place);
    });
  }

  autocompleteInputChange(event) {
    this.getAssignAddress(event.target.value);
  }

  clearDocument() {
    this.currentApplicant.AttachedFilePath = null;
    this.cd.detectChanges();
  }

}
