import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from 'src/@cv/services/validation.service';
import { ApplicantReferences } from 'src/@shared/core/jobcentral/model/applicantrefences';

@Component({
  selector: 'cv-job-applicant-references',
  templateUrl: './job-applicant-references.component.html',
  styleUrls: ['./job-applicant-references.component.scss']
})
export class JobApplicantReferencesComponent implements OnInit {

  @Input('IsMandatory') IsMandatory: boolean=false;
  @Input('reference1') reference1: ApplicantReferences;
  @Input('reference2') reference2: ApplicantReferences;
  @Input('IsReadonly') IsReadonly: boolean=false;
 
  @Output() out_Reference1 = new EventEmitter<any>();
  @Output() out_Reference2 = new EventEmitter<any>();
  @Output() reference1_formValidityChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() reference2_formValidityChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  ref1FromGroup: FormGroup;
  ref2FromGroup: FormGroup;
  constructor(private fb: FormBuilder,
    private cdRef: ChangeDetectorRef) {
      this.ref1FromGroup = this.fb.group({
        firstName: [null, this.IsMandatory ? [ValidationService.onlyAlphabetsValidator, Validators.required] : [ValidationService.onlyAlphabetsValidator]],
        lastName: [null, this.IsMandatory ? [ValidationService.onlyAlphabetsValidator, Validators.required] : [ValidationService.onlyAlphabetsValidator]],
        company: [null, this.IsMandatory ? [Validators.required] : []],
        designation: [null, this.IsMandatory ? [Validators.required] : []],
        email: [null, this.IsMandatory ? [ValidationService.emailValidator,Validators.required] : [ValidationService.emailValidator]],
        phonenumber: [null, this.IsMandatory ? [ValidationService.phonenumValidator, Validators.required] : [ValidationService.phonenumValidator]]
      });
    this.ref2FromGroup = this.fb.group({
        firstName: [null, this.IsMandatory ? [ValidationService.onlyAlphabetsValidator, Validators.required] : [ValidationService.onlyAlphabetsValidator]],
        lastName: [null, this.IsMandatory ? [ValidationService.onlyAlphabetsValidator, Validators.required] : [ValidationService.onlyAlphabetsValidator]],
        company: [null, this.IsMandatory ? [Validators.required] : []],
        designation: [null, this.IsMandatory ? [Validators.required] : []],
        email: [null, this.IsMandatory ? [ValidationService.emailValidator, Validators.required] : [ValidationService.emailValidator]],
        phonenumber: [null, this.IsMandatory ? [ValidationService.phonenumValidator, Validators.required] : [ValidationService.phonenumValidator]]
    });

    this.ref1FromGroup.valueChanges.subscribe(() => {
      this.reference1_formValidityChanged.emit(this.ref1FromGroup.valid);
    });

    this.ref2FromGroup.valueChanges.subscribe(() => {
      this.reference2_formValidityChanged.emit(this.ref2FromGroup.valid);
    });

  }

  ngOnInit(): void {
  }


  OnReferece1_InputChange(event){
    this.out_Reference1.emit(this.reference1);
  }

  OnReferece2_InputChange(event){
    this.out_Reference2.emit(this.reference2);
  }

}
