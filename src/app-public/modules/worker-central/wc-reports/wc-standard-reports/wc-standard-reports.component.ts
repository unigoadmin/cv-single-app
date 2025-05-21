import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import icBook from '@iconify/icons-ic/twotone-book';
import icPerson from '@iconify/icons-ic/twotone-person';
import icLayers from '@iconify/icons-ic/twotone-layers';
import icschedule from '@iconify/icons-ic/schedule';
import icConfirmation from '@iconify/icons-ic/confirmation-number';
import { WCReportsService } from 'src/@shared/core/reports/http/wc-reports.service';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { LoginUser } from 'src/@shared/models';
import { TransactionalReport } from 'src/@shared/core/reports/models/transactionalreport';
import { ReportDataService } from 'src/@shared/services/reportsdata.service';
import { Router } from '@angular/router';

@Component({
  selector: 'cv-wc-standard-reports',
  templateUrl: './wc-standard-reports.component.html',
  styleUrls: ['./wc-standard-reports.component.scss']
})
export class WcStandardReportsComponent implements OnInit {
  
  loginUser: LoginUser;
  icBook = icBook;
  icPerson = icPerson;
  icLayers = icLayers;
  icschedule = icschedule;
  icConfirmation = icConfirmation;
  placementPanelOpenState: boolean = false;
  WorkerPanelOpenState: boolean = false;
  assignmentsPanelOpenState: boolean = false;
  timesheetPanelOpenState: boolean = false;
  WorkPermitExpiryPanelOpenState : boolean = false;
  I94ExpiryPanelOpenState: boolean = false;
  transactionalReport: TransactionalReport[] = [];
  assignmentsReport:TransactionalReport[] =[];
  workersReport:TransactionalReport[]=[];
  placementsReport:TransactionalReport[]=[];
  timesheetsReport:TransactionalReport[]=[];
  workPermitExpiryReport:TransactionalReport[]=[];
  i94ExpiryReport:TransactionalReport[]=[];
  constructor(
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private reportsService: WCReportsService,
    private reportdataservice: ReportDataService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.GetReportsByCategory(2); // 1 -- ATS //2-wc
    }
  }

  GetReportsByCategory(id) {
    this.reportsService.GetReportsByCategory(this.loginUser.Company.Id, id).subscribe(response => {
      this.transactionalReport = response.Data
      if(this.transactionalReport!=null && this.transactionalReport.length > 0){
        this.placementsReport = this.transactionalReport.filter(i => i.ReportTypeId == 4);
        this.workersReport = this.transactionalReport.filter(i => i.ReportTypeId == 5);
        this.assignmentsReport = this.transactionalReport.filter(i => i.ReportTypeId == 6);
        this.timesheetsReport = this.transactionalReport.filter(i=> i.ReportTypeId==7);
        this.workPermitExpiryReport = this.transactionalReport.filter(i=> i.ReportTypeId==11);
        this.i94ExpiryReport = this.transactionalReport.filter(i=> i.ReportTypeId==12);
      }
     

    }, error => {
      this._alertService.error(error);
    })
  }

  openReport(report: any, module:string): void {
    console.log(report);
    this.reportdataservice.setReportData({
      reportTypeId: report.ReportTypeId,
      reportId: report.ReportId,
      isDefault: report.IsDefault,
      reportTypeName: report.ReportName,
      moduleName: module,
      category: report.CategoryId,
    });
  
    // Navigate without route parameters
    this.router.navigate(['/worker-central/wc-reports/report-view']);
  }

}
