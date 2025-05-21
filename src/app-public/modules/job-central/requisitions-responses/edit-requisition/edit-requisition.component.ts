import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService, TimeZoneService } from 'src/@shared/services';
import { RequisitionService } from '../../core/http/requisitions.service';
import { Requisitions } from '../../core/model/requisitions';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { IconService } from 'src/@shared/services/icon.service';
import { stagger80ms } from 'src/@cv/animations/stagger.animation';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { scaleIn400ms } from 'src/@cv/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@cv/animations/fade-in-right.animation';
import { isNullOrUndefined } from 'src/@shared/services/helpers';
import { EmitterService } from 'src/@cv/services/emitter.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import moment from 'moment';
import { MatSelectChange } from '@angular/material/select';
import { AccountTypes } from 'src/static-data/accounttypes';

@Component({
  selector: 'cv-edit-requisition',
  templateUrl: './edit-requisition.component.html',
  styleUrls: ['./edit-requisition.component.scss'],
  animations: [
    stagger80ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms
  ],
  providers:[TimeZoneService,AccountTypes]
})
export class EditRequisitionComponent implements OnInit {

  loginUser: LoginUser;
  CurrentRequisition: Requisitions = new Requisitions();
  RequisitionSubmitForm: FormGroup;
  FieldGlassForm:FormGroup;
  isSummary:boolean=true;
  IsNotes:boolean=false;
  IsSubmissions:boolean=false;
  CreatedDate:any;
  SubmittedDate:any;
  UpdatedDate:any;
  SelectedJobMode: string = "Remote";
  IsPageDirty:boolean=false;
  LocationRequired:boolean=false; IsLocation:boolean=false;
  SelectedType: any = 3;SalaryType: any = 1;salaryRangeType: number = 1;
  SelectedPrimarySkills: string[] = [];
  IsC2C:boolean=false;IsW2:boolean=false;IsCTH:boolean=false;
  IsFormValid:boolean=false;
  selectedCheckboxes= [];
  ApplicantStausList: any[];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EditRequisitionComponent>,
    private _authService: AuthenticationService,
    private _reqService: RequisitionService,
    private _alertService: AlertService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    public iconService: IconService,
    private accountTypes: AccountTypes,
  ) {
    this.FieldGlassForm= this.fb.group({
      JobTitle:[''],
      PostingId:[''],
      Positions:[''],
      Buyer:[''],
      Site:[''],
      Coordinator:[''],
      PostingOwner:[''],
      StartDate:[''],
      EndDate:[''],
      JobMode: ['', Validators.required],
      Location: ['', this.checkLocationRequired()],
      SelectedType: ['', Validators.required],
      SalaryType: [''],
      JobTypeID: ['',this.checkJobTypeId()],
      MinSalary: [''],
      MaxSalary: [''],
      JobDurtionMonths: ['',Validators.max(24)],
      salaryRangeType: [''],
      JobDescription: [''],
      C2C:[''],W2:[''],CTH:[''],
      VisaSponsor:[],
      PrimarySkills:['',Validators.required],
      JcType:['',this.checkJobType_Contract()],
      BillRate:['',Validators.required],
      MaxSubmissions:[''],
     

    });
    this.ApplicantStausList = this.accountTypes.RequisitionStatusList;
  }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      if(this.data.RequisitionId > 0)
        this.GetRequisitionById(this.data.RequisitionId);
      else{
        this.CurrentRequisition = new Requisitions();
        this.CurrentRequisition.JobLocationType = this.SelectedJobMode;
        this.CurrentRequisition.JobCategory = this.SelectedType;
      }
      
    }
  }

  GetRequisitionById(RequisitionId: number) {debugger;
    this.CurrentRequisition = new Requisitions();
    this._reqService.GetRequisitionDetailsById(RequisitionId, this.loginUser.Company.Id).subscribe(response => {
      if (response.IsError) {
        this._alertService.error(response.ErrorMessage);
      } else {
        this.CurrentRequisition = response.Data;

        if(!this.CurrentRequisition.JobLocationType){
          this.CurrentRequisition.JobLocationType=this.SelectedJobMode;
        }
        else{
          this.SelectedJobMode = this.CurrentRequisition.JobLocationType;
        }

        if (!isNullOrUndefined(this.CurrentRequisition.JobCategory)) {
          this.SelectedType = this.CurrentRequisition.JobCategory;
          if (this.SelectedType == 2) {
            if (!isNullOrUndefined(this.CurrentRequisition.JobTypeId)) {
              this.FieldGlassForm.get('JobTypeID').setValue(this.CurrentRequisition.JobTypeId);
            }
            this.FieldGlassForm.get('JcType').clearValidators();
            this.FieldGlassForm.get('JcType').updateValueAndValidity();
          }
          else if (this.SelectedType == 3) {
            if (!isNullOrUndefined(this.CurrentRequisition.ContractType)) {
              const values = this.CurrentRequisition.ContractType.split(',');
              values.forEach(value => {
                if (value == "C2C"){
                  this.IsC2C = true;
                  this.selectedCheckboxes.push('C2C');
                }
                if (value == "CTH") {
                  this.IsCTH = true;
                  this.selectedCheckboxes.push('CTH');
                }
                if (value == "W2") {
                  this.IsW2 = true;
                  this.selectedCheckboxes.push('W2');
                }
              });
              this.FieldGlassForm.get('JcType').setValue(values);
            }
            this.FieldGlassForm.get('JobTypeID').clearValidators();
            this.FieldGlassForm.get('JobTypeID').updateValueAndValidity();
          }
          this.checkJobType_Contract();
          this.checkJobTypeId();
        }
        else {
          this.SelectedType = 3;
        }

        if (!isNullOrUndefined(this.CurrentRequisition.PrimarySkills)) {
          this.SelectedPrimarySkills = this.CurrentRequisition.PrimarySkills.split(",");
          this.FieldGlassForm.get('PrimarySkills').setValue(this.SelectedPrimarySkills);
        }
        if(!isNullOrUndefined(this.CurrentRequisition.SalaryType)){
          this.SalaryType = this.CurrentRequisition.SalaryType;
          this.onSalaryTypeChange(this.SalaryType);
        }
        if(!isNullOrUndefined(this.CurrentRequisition.salaryRangeType)){
          this.salaryRangeType = this.CurrentRequisition.salaryRangeType;
          this.OnsalaryRangeTypeChanged();
        }
        this.CreatedDate = TimeZoneService.ConvertToDateFormat(this.CurrentRequisition.CreatedDate, true);
        this.SubmittedDate = this.CurrentRequisition.SubmittedDate!=null ?TimeZoneService.ConvertToDateFormat(this.CurrentRequisition.SubmittedDate, true) : null;
        this.UpdatedDate = this.CurrentRequisition.UpdatedDate!=null ?TimeZoneService.ConvertToDateFormat(this.CurrentRequisition.UpdatedDate, true): null;

        if (!isNullOrUndefined(this.CurrentRequisition.StartDate)) {
          let StartDate: any = moment(this.CurrentRequisition.StartDate).format("YYYY-MM-DDTHH:mm:ss.ms")
          this.CurrentRequisition.StartDate = StartDate;
        }

        if (!isNullOrUndefined(this.CurrentRequisition.EndDate)) {
          let EndDate: any = moment(this.CurrentRequisition.EndDate).format("YYYY-MM-DDTHH:mm:ss.ms")
          this.CurrentRequisition.EndDate = EndDate;
        }
      }
      if (!this.cdr["destroyed"]) {
        this.cdr.detectChanges();
      }
    }, error => {
      this._alertService.error(error);
      if (!this.cdr["destroyed"]) {
        this.cdr.detectChanges();
      }
    })
  }

  onTabChanged(event: MatTabChangeEvent) {
    if (event.index === 0) {
      this.isSummary = true;
      this.IsNotes=false;
      this.IsSubmissions=false;
    } else if (event.index === 1) {
      this.isSummary = false;
      this.IsNotes=false;
      this.IsSubmissions=true;
    }
    else if(event.index === 2){
      this.isSummary = false;
      this.IsNotes=true;
      this.IsSubmissions=false;
    }

    if (!this.cdr["distroyed"]) {
      this.cdr.detectChanges();
    }
  }

  save(){debugger;
    this.CurrentRequisition.SalaryType = this.SalaryType;
    this.CurrentRequisition.salaryRangeType = this.salaryRangeType;
    this.CurrentRequisition.ContractType = this.selectedCheckboxes.join(',');
    this.CurrentRequisition.JobCategory = this.SelectedType;
    if (this.SelectedPrimarySkills.length > 0) {
      this.CurrentRequisition.PrimarySkills = this.SelectedPrimarySkills.join(",");
    }

    if (!isNullOrUndefined(this.CurrentRequisition.EndDate)) {
      let EndDate: any = moment(this.CurrentRequisition.EndDate).format("YYYY-MM-DDTHH:mm:ss.ms")
      this.CurrentRequisition.EndDate = EndDate;
    }

    if (!isNullOrUndefined(this.CurrentRequisition.StartDate)) {
      let StartDate: any = moment(this.CurrentRequisition.StartDate).format("YYYY-MM-DDTHH:mm:ss.ms")
      this.CurrentRequisition.StartDate = StartDate;
    }

    this.CurrentRequisition.CompanyId = this.loginUser.Company.Id;
    if(this.data.RequisitionId == 0){
      this.CurrentRequisition.Status = 1;
    }

    this._reqService.UpdateRequisition(this.CurrentRequisition).subscribe(response => {
      if (response.IsError) {
        this._alertService.error(response.ErrorMessage);
      } else {
        this._alertService.success('Requisition updated successfully');
        this.dialogRef.close(true);
        EmitterService.get("editRequisiton").emit(true);
      }
    }, error => {
      this._alertService.error(error);
    })
  }

  contentChanged(obj: any) {
    this.CurrentRequisition.JobDescription = obj.html;
  }

  EditorCreated(event: any) {

  }

  modules = {
    formula: false,
    toolbar: [      
    ['bold', 'italic', 'underline', 'strike'],
    ['code-block'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }]
    ]
  };

  JobModeChange(event) {
    this.SelectedJobMode = event.value;
    this.CurrentRequisition.JobLocationType = event.value;
    if(event.value!="Remote"){
      this.LocationRequired = true;
    }

    if (!this.cdr["distroyed"]) {
      this.cdr.detectChanges();
    }
  }

  getAssignAddress(event) {
    this.IsPageDirty = true;
    let data = event.address_components
    this.CurrentRequisition.Location = "";
    this.CurrentRequisition.City = "";
    this.CurrentRequisition.State = "";

    if (data && data.length > 0) {
      for (let address of data) {
        if ((address.types.includes("sublocality") || (address.types.includes("locality")))) {
          this.CurrentRequisition.City = address.long_name;
        }
        else if (address.types.includes("administrative_area_level_1")) {
          this.CurrentRequisition.State = address.short_name;
        }
      }
      this.CurrentRequisition.Location = this.CurrentRequisition.City + ', ' + this.CurrentRequisition.State;
      this.FieldGlassForm.get('Location').setValue(this.CurrentRequisition.Location);
      this.IsLocation = true;
      this.IsPageDirty=true;
    }
    else {
      this.CurrentRequisition.Location = null;
      this.IsLocation = false;
    }
    if (!this.cdr["distroyed"]) {
      this.cdr.detectChanges();
    }
  }

  inputAssignAddress(event) {
    this.getAssignAddress(event.target.value);
  }

  OnRequirementChange(value) {
    this.CurrentRequisition.JobCategory = value;
    this.SelectedType = value;
    if(value==2){
      this.selectedCheckboxes=[];
      this.FieldGlassForm.get("JobTypeID").setValidators(Validators.required);
      this.FieldGlassForm.get("JobTypeID").updateValueAndValidity();
      this.FieldGlassForm.get('JcType').setValue(null);
      this.FieldGlassForm.get('JcType').clearValidators();
      this.FieldGlassForm.get("JcType").updateValueAndValidity();
      this.IsC2C=false;this.IsCTH=false;this.IsW2=false;
    }else if(value == 3){
      this.CurrentRequisition.JobTypeId=null;
      this.FieldGlassForm.get('JobTypeID').setValue(null);
      this.FieldGlassForm.get("JobTypeID").clearValidators();
      this.FieldGlassForm.get("JobTypeID").updateValueAndValidity();
      this.FieldGlassForm.get('JcType').setValidators(Validators.required);
      this.FieldGlassForm.get("JcType").updateValueAndValidity();
    }

    if (!this.cdr["destroyed"]) {
      this.cdr.detectChanges();
    }
  }

  onSalaryTypeChange(event) {
    // if (event.value == 1) {
    //   this.onRemoveSalaryTypeValidation();
    // } else
    //   this.SetSalaryTypeValidation();
  }

  onRemoveSalaryTypeValidation() {
    this.FieldGlassForm.controls["MinSalary"].clearValidators();
    this.FieldGlassForm.controls["MinSalary"].updateValueAndValidity();
    this.FieldGlassForm.controls["MaxSalary"].clearValidators();
    this.FieldGlassForm.controls["MaxSalary"].updateValueAndValidity();
  }
  SetSalaryTypeValidation() {
    this.FieldGlassForm.controls["MinSalary"].setValidators(Validators.required);
    this.FieldGlassForm.controls["MinSalary"].updateValueAndValidity();
    this.FieldGlassForm.controls["MaxSalary"].setValidators(Validators.required);
    this.FieldGlassForm.controls["MaxSalary"].updateValueAndValidity();
  }

  OnsalaryRangeTypeChanged(){
    if(this.salaryRangeType==2){
      this.CurrentRequisition.MinSalary = '$0';
    }
   }

   GetPrimarySkills(event) {debugger;
    this.SelectedPrimarySkills = event;
    this.FieldGlassForm.markAsDirty();
    this.IsPageDirty = true;
    this.FieldGlassForm.get('PrimarySkills').setValue(this.SelectedPrimarySkills);
    if (!this.cdr["distroyed"]) {
      this.cdr.detectChanges();
    }
  }

  checkLocationRequired() {debugger;
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (this.SelectedJobMode !== 'Remote' && !control.value) {
        return { locationRequired: true };
      }
      return null;
    };
  }

  checkJobType_Contract(){debugger;
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (this.SelectedType == 3 && !control.value) {
        return { JcType: true };
      }
      return null;
    };
  }

  checkJobTypeId(){
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (this.SelectedType == 2 && !control.value) {
        return { JoBTypeId: true };
      }
      return null;
    };
  }

  OnContractTypeChanged(event:MatCheckboxChange,itemValue:string){debugger;

    if (itemValue == "C2C" && event.checked == true) {
      this.selectedCheckboxes.push('C2C');
    } else if (itemValue == "C2C" && event.checked == false) {
      const index = this.selectedCheckboxes.indexOf(itemValue);
      if (index !== -1) {
        this.selectedCheckboxes.splice(index, 1);
      }
    }

    if (itemValue=="W2" && event.checked==true) {
      this.selectedCheckboxes.push('W2');
    }
    else if (itemValue == "W2" && event.checked == false) {
      const index = this.selectedCheckboxes.indexOf(itemValue);
      if (index !== -1) {
        this.selectedCheckboxes.splice(index, 1);
      }
    }

    if (itemValue=="CTH" && event.checked==true) {
      this.selectedCheckboxes.push('CTH');
    }
    else if (itemValue == "CTH" && event.checked == false) {
      const index = this.selectedCheckboxes.indexOf(itemValue);
      if (index !== -1) {
        this.selectedCheckboxes.splice(index, 1);
      }
    }

    if(this.selectedCheckboxes.length > 0){
      this.FieldGlassForm.get('JcType').setValue(this.selectedCheckboxes);
    }
    else{
      this.FieldGlassForm.get('JcType').setValue(null);
    }
   
  }

  onLabelChange(change: MatSelectChange){debugger;
    var selectedStatus = change.value;
    this.CurrentRequisition.StatusName = selectedStatus.label;
    this.CurrentRequisition.Status = selectedStatus.value;
    const Psubmission = {
      RequisitionId: this.CurrentRequisition.RequisitionId,
      companyId: this.loginUser.Company.Id,
      ApplicantStatus: selectedStatus.value,
      UpdatedBy: this.loginUser.UserId
    };
    this._reqService.UpdateRequistionStatus(Psubmission)
      .subscribe(
        response => {
          if (response.IsError == false) {
            this._alertService.success(response.SuccessMessage);
            EmitterService.get("editRequisiton").emit(true);
          }
        },
        error => {
          this._alertService.error(error);
        }
      );
  }

  ResetForm(){
    this.GetRequisitionById(this.data.RequisitionId);
  }

  public findInvalidControls() {debugger;
    const invalid = [];
    const controls = this.FieldGlassForm.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }

    console.log(invalid);
  
    return invalid;
  }

}
