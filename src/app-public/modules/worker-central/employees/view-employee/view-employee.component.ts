import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import icClose from '@iconify/icons-ic/twotone-close';
import { Inject } from '@angular/core';
import { LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { stagger80ms } from 'src/@cv/animations/stagger.animation';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { scaleIn400ms } from 'src/@cv/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@cv/animations/fade-in-right.animation';
import { PlacementService } from '../../core/http/placement.service';
import { AccountTypes } from 'src/static-data/accounttypes';
import { InvoiceCycle } from '../../core/models/onboardingEnum';
import { FileStoreService } from 'src/@shared/services/file-store.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeeMaster } from '../../core/models/employeemaster';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import icArrowDropDown from '@iconify/icons-ic/twotone-arrow-drop-down';
import icAdd from '@iconify/icons-ic/twotone-add';

@Component({
  selector: 'cv-view-employee',
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    stagger80ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms
  ],
  providers: [AccountTypes, PlacementService, InvoiceCycle, FileStoreService]
})
export class ViewEmployeeComponent implements OnInit {

  icClose = icClose;
  icEdit = icEdit;
  icDelete = icDelete;
  icMoreVert=icMoreVert;
  icArrowDropDown=icArrowDropDown;
  icAdd=icAdd;
  loginUser: LoginUser;
  public Employee: EmployeeMaster = new EmployeeMaster();

  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public Data: any,
    private _authService: AuthenticationService,
    private _alertService: AlertService,
    private _service: PlacementService,
    private cdRef: ChangeDetectorRef,) {
  }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.GetEmployees();
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    }
  }
  GetEmployees() {
    this.Employee = new EmployeeMaster();
    this._service.GetEmployeeByID(this.Data,this.loginUser.Company.Id).subscribe(response => {
      if (response.IsError) {
        this._alertService.error(response.ErrorMessage);
      } else {
        this.Employee=response.Data;
        if (!this.cdRef["distroyed"]) {
          this.cdRef.detectChanges();
        }
      }
    }, error => {
      this._alertService.error(error);
    })
  }
}
