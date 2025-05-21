import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import icBook from '@iconify/icons-ic/twotone-book';
import icPerson from '@iconify/icons-ic/twotone-person';
import icLayers from '@iconify/icons-ic/twotone-layers';
import icschedule from '@iconify/icons-ic/schedule';
import icConfirmation from '@iconify/icons-ic/confirmation-number';
import { ReportsService } from '../reports.service';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { LoginUser } from 'src/@shared/models';
import { TransactionalReport } from '../../core/models/transactionalreport';
import { UserModules } from 'src/@cv/models/accounttypeenum';
import { ReportDataService } from 'src/@shared/services/reportsdata.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cv-standard-reports',
  templateUrl: './standard-reports.component.html',
  styleUrls: ['./standard-reports.component.scss']
})
export class StandardReportsComponent implements OnInit {
  loginUser: LoginUser;
  icBook = icBook;
  icPerson = icPerson;
  icLayers = icLayers;
  icschedule = icschedule;
  icConfirmation = icConfirmation;
  submissionPanelOpenState: boolean = false;
  candidatePanelOpenState: boolean = false;
  jobsPanelOpenState: boolean = false;
  interviewPanelOpenState: boolean = false;
  confirmPanelOpenState: boolean = false;
  candidatesReport:TransactionalReport[] = [];
  transactionalReport: TransactionalReport[] = [];
  submissionsReport:TransactionalReport[] =[];
  interviewsReport:TransactionalReport[]=[];
  confirmationsReport:TransactionalReport[]=[];
  currentModule:string;
  constructor(
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private reportsService: ReportsService,
    private reportdataservice: ReportDataService,
    private router: Router,
    private route: ActivatedRoute
  ) { 
    this.currentModule = UserModules.TalentCentral;
  }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.GetReportsByCategory(1); // 1 -- ATS
    }
  }

  GetReportsByCategory(id) {
    this.reportsService.GetReportsByCategory(this.loginUser.Company.Id, id).subscribe(response => {
      this.transactionalReport = response.Data
      if(this.transactionalReport!=null && this.transactionalReport.length > 0){
        this.candidatesReport = this.transactionalReport.filter(i=>i.ReportTypeId == 8);
        this.submissionsReport = this.transactionalReport.filter(i => i.ReportTypeId == 1);
        this.interviewsReport = this.transactionalReport.filter(i => i.ReportTypeId == 2);
        this.confirmationsReport = this.transactionalReport.filter(i => i.ReportTypeId == 3);
      }
     

    }, error => {
      this._alertService.error(error);
    })
  }

  openReport(report: any, module:string): void {
    this.reportdataservice.setReportData({
      reportTypeId: report.ReportTypeId,
      reportId: report.ReportId,
      isDefault: report.IsDefault,
      reportTypeName: report.ReportName,
      moduleName: module,
      category: report.CategoryId,
    });
  
    // Navigate without route parameters
    this.router.navigate(
      ['report-view'], 
      { relativeTo: this.route }
    );
  }

}
