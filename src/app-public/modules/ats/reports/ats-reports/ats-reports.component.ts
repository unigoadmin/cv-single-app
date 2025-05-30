import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import icBook from '@iconify/icons-ic/twotone-book';
import icPerson from '@iconify/icons-ic/twotone-person';
import icLayers from '@iconify/icons-ic/twotone-layers';
import icschedule from '@iconify/icons-ic/schedule';
import icConfirmation from '@iconify/icons-ic/confirmation-number';
import { ReportsService } from './reports.service';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { LoginUser } from 'src/@shared/models';
import { TransactionalReport } from './../core/models/transactionalreport';
import { isNullOrUndefined } from 'src/@shared/services/helpers';
import icReports from '@iconify/icons-ic/round-file-copy';
import { NgxPermissionsService } from 'ngx-permissions';


@Component({
  selector: 'cv-ats-reports',
  templateUrl: './ats-reports.component.html',
  styleUrls: ['./ats-reports.component.scss']
})
export class AtsReportsComponent implements OnInit {
  loginUser: LoginUser;
  icBook = icBook;
  icPerson = icPerson;
  icLayers = icLayers;
  icschedule = icschedule;
  icConfirmation = icConfirmation;
  icReports=icReports;
  submissionPanelOpenState: boolean = false;
  candidatePanelOpenState: boolean = false;
  jobsPanelOpenState: boolean = false;
  interviewPanelOpenState: boolean = false;
  confirmPanelOpenState: boolean = false;
  transactionalReport: TransactionalReport[] = [];
  Default: string = "true";
  index: number = 0
  constructor(
    private _authService: AuthenticationService,
    private permissionsService: NgxPermissionsService
  ) {
    this.Default = localStorage.getItem("Default");
    if (!isNullOrUndefined(this.Default) && this.Default != '') {
      if (this.Default === "true")
        this.index = 0;
      else
        this.index = 1;
    }

  }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
    }
    localStorage.removeItem("Default");
  }


}
