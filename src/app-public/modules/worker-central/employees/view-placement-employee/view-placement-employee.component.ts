import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import icDoneAll from '@iconify/icons-ic/twotone-done-all';
import icPictureAsPdf from '@iconify/icons-ic/twotone-picture-as-pdf';
import iclocationon from '@iconify/icons-ic/location-on';
import icdelete from '@iconify/icons-ic/delete';
import icvieweye from '@iconify/icons-ic/remove-red-eye';
import icClose from '@iconify/icons-ic/twotone-close';
import icfileupload from '@iconify/icons-ic/file-upload';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoginUser } from 'src/@shared/models';
import { EmployeeMaster } from '../../core/models/employeemaster';
import icPerson from '@iconify/icons-ic/twotone-person';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { PlacementService } from '../../core/http/placement.service';
import { AccountTypes } from 'src/static-data/accounttypes';
import { InvoiceCycle } from '../../core/models/onboardingEnum';
import { FileStoreService } from 'src/@shared/services/file-store.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { stagger80ms } from 'src/@cv/animations/stagger.animation';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { scaleIn400ms } from 'src/@cv/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@cv/animations/fade-in-right.animation';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import icArrowDropDown from '@iconify/icons-ic/twotone-arrow-drop-down';
import { AssignmentMaster } from '../../core/models/assignmentmaster';
import icAdd from '@iconify/icons-ic/twotone-add';

@Component({
  selector: 'cv-view-placement-employee',
  templateUrl: './view-placement-employee.component.html',
  styleUrls: ['./view-placement-employee.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    stagger80ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms
  ],
  providers: [AccountTypes, PlacementService, InvoiceCycle, FileStoreService]
})
export class ViewPlacementEmployeeComponent implements OnInit {

  empdisplayedColumns: string[] = ['position', 'name', 'type', 'actions'];

  icFileUpload = icfileupload;
  icClose = icClose;
  icDoneAll = icDoneAll;
  icPictureAsPdf = icPictureAsPdf;
  iclocationon = iclocationon;
  icPerson = icPerson;
  icdelete = icdelete;
  icvieweye = icvieweye
  icEdit = icEdit;
  icDelete = icDelete;
  icMoreVert=icMoreVert;
  icArrowDropDown=icArrowDropDown;
  icAdd=icAdd;
  loginUser: LoginUser;
  public Employee: EmployeeMaster = new EmployeeMaster();
 
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public Data: any,
    private dialogRef: MatDialogRef<ViewPlacementEmployeeComponent>,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private accountTypes: AccountTypes,
    private cdRef: ChangeDetectorRef,
    private _service: PlacementService,
  ) {

  }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.GetEmployeeByID();
    }
  }
  GetEmployeeByID() {
    this.Employee = new EmployeeMaster();
    this._service.GetEmployeeByID(this.Data, this.loginUser.Company.Id).subscribe(response => {
      if (response.IsError) {
        this._alertService.error(response.ErrorMessage);
      } else {
        this.Employee = response.Data;
        console.log(this.Employee);
        this.Employee.AssignmentMasters = this.Employee.AssignmentMasters.sort((a, b) => new Date(b.EndDate).getTime() - new Date(a.EndDate).getTime());
        if (!this.cdRef["distroyed"]) {
          this.cdRef.detectChanges();
        }
      }
    }, error => {
      this._alertService.error(error);
    })
  }

  getFormattedAddress(row:AssignmentMaster){
   return [row.WLAddress1, row.WLAddress2,row.WLCity, row.WLState,row.WLZipCode].filter(Boolean).join(", ");
  }

}
