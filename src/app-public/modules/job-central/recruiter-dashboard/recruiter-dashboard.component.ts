import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import icGroup from '@iconify/icons-ic/twotone-group';
import icPageView from '@iconify/icons-ic/twotone-pageview';
import icCloudOff from '@iconify/icons-ic/twotone-cloud-off';
import icTimer from '@iconify/icons-ic/twotone-timer';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { JobCentralService } from '../core/http/job-central.service';
import { LoginUser } from 'src/@shared/models';
import { JobCentralSummary } from '../core/model/jcsummary';
import icCheckCircle from '@iconify/icons-ic/twotone-check-circle';
import { EmitterService } from 'src/@cv/services/emitter.service';
import { TableColumn } from 'src/@cv/interfaces/table-column.interface';
import { JobMaster } from '../core/model/jobmaster';
import { MatTableDataSource } from '@angular/material/table';
import moment from 'moment';

@Component({
  selector: 'cv-jc-dashboard',
  templateUrl: './recruiter-dashboard.component.html',
  styleUrls: ['./recruiter-dashboard.component.scss']
})
export class JCRecruiterDashboardComponent implements OnInit {

  icMoreVert = icMoreVert;
  icGroup = icGroup;
  icPageView = icPageView;
  icCloudOff = icCloudOff;
  icTimer = icTimer;
  loginUser: LoginUser;
  applicantSummary: JobCentralSummary;
  MyApplicants: any;
  AllApplicants: any;
  Welcometitle: string;
  ApplicantsProcessingRate: number = 0;
  icCheckCircle = icCheckCircle;
  dashboardNvigateUrl: string = "";
  tableData:any = [];
  constructor(private _alertService: AlertService,
    private _jobcentralService: JobCentralService,
    private _authService: AuthenticationService,
    private cdr: ChangeDetectorRef) {
    this.tableData=[];  
    this.applicantSummary = new JobCentralSummary();
  }

  tableColumns: TableColumn<JobMaster>[] = [
    { label: 'JobId', property: 'UniqueJobId', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium',] },
    { label: 'Source', property: 'JobSource', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium',] },
    { label: 'Job Title', property: 'JobTitle', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium',] },
    { label: 'Applicants', property: 'MappedApplicants', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
  ];
  

  ngOnInit(): void {
    //let browserDate = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss");
    //let utcdate:any = moment(new Date()).utc().format("YYYY-MM-DDTHH:mm:ss");
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      EmitterService.get("JobCentral").emit("JobCentral");
      this.Welcometitle = 'Hello ' + this.loginUser.FirstName + ' !';
      this.getJobCentralSummary();
    }
  }

  getJobCentralSummary() {
    const dsparams = {
      UserId: this.loginUser.UserId,
      CompanyId: this.loginUser.Company.Id,
      Duration: 8,//LAST WEEK
      CurrentDate: moment(new Date()).utc().format("YYYY-MM-DDTHH:mm:ss")
    }
    this._jobcentralService.GetJobCentralSummary(dsparams)
      .subscribe(
        result => {
          if (result.Data != null) {
            debugger;
            this.applicantSummary = result.Data;
            if (this.applicantSummary.TotalAppsAssiged > 0) {
              this.ApplicantsProcessingRate = (this.applicantSummary.TotalApplicantsProcessed / this.applicantSummary.TotalAppsAssiged) * 100;
            }
            this.getAciveJobs();
          }
          if (!this.cdr["distroyed"]) {
            this.cdr.detectChanges();
          }
        },
        error => {
          this._alertService.error(error);
          if (!this.cdr["distroyed"]) {
            this.cdr.detectChanges();
          }
        }
      );
  }

  getAciveJobs() {
    const JobFilter = {
      PageSize: 100,
      PageIndex: 0,
      SearchByStatus: 3,
      EmployeeId: this.loginUser.UserId,
      CompanyId: this.loginUser.Company.Id
    }
    // this.candidateFilters.CompanyId = 
    // this.candidateFilters.EmployeeId = this.loginUser.UserId;
    // this.candidateFilters.PageIndex = 0;
    // this.candidateFilters.PageSize = 100;
    // this.candidateFilters.SearchByStatus=this.JobStatus;
    this._jobcentralService.getAllBenchJobs(JobFilter).subscribe(result => {
      if (result.IsError) {
        this._alertService.error(result.ErrorMessage);
      } else {
        //this.dataSource.data = result.Data;
        this.tableData = result.Data;
      }
      if (!this.cdr["distroyed"]) {
        this.cdr.detectChanges();
      }
    }, error => {
      this._alertService.error(error);
    });

  }



}
