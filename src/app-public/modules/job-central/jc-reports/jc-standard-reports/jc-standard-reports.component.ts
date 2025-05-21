import { Component, OnInit } from '@angular/core';
import { UserModules } from 'src/@cv/models/accounttypeenum';
import { TransactionalReport } from 'src/@shared/core/reports/models/transactionalreport';
import { LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { ReportsService } from '../../../ats/reports/ats-reports/reports.service';
import { IconService } from 'src/@shared/services/icon.service';
import { ReportDataService } from 'src/@shared/services/reportsdata.service';
import { Router } from '@angular/router';

@Component({
  selector: 'cv-jc-standard-reports',
  templateUrl: './jc-standard-reports.component.html',
  styleUrls: ['./jc-standard-reports.component.scss']
})
export class JcStandardReportsComponent implements OnInit {

  loginUser: LoginUser;
  recruiterPanelOpenState:boolean = false;
  applicantsPanelOpenState:boolean = false;

  recruitersReport:TransactionalReport[] = [];
  applicantsReport: TransactionalReport[] = [];
  
  transactionalReport: TransactionalReport[] = [];
  
  currentModule:string;
  constructor(
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private reportsService: ReportsService,
    public iconService: IconService,
    private reportdataservice: ReportDataService,
    private router: Router,
  ) { 
    this.currentModule = UserModules.JobCentral;
  }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.GetReportsByCategory(3); // 1 -- ATS
    }
  }

  GetReportsByCategory(id) {
    this.reportsService.GetReportsByCategory(this.loginUser.Company.Id, id).subscribe(response => {
      this.transactionalReport = response.Data
      if(this.transactionalReport!=null && this.transactionalReport.length > 0){
        this.recruitersReport = this.transactionalReport.filter(i=>i.ReportTypeId == 9);
        this.applicantsReport = this.transactionalReport.filter(i => i.ReportTypeId == 10);
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
    this.router.navigate(['/job-central/jc-reports/report-view']);
  }

 

}
