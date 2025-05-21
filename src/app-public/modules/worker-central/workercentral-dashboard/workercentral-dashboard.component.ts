import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import icGroup from '@iconify/icons-ic/twotone-group';
import icPageView from '@iconify/icons-ic/twotone-pageview';
import icCloudOff from '@iconify/icons-ic/twotone-cloud-off';
import icTimer from '@iconify/icons-ic/twotone-timer';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { PlacementService } from '../core/http/placement.service';
import { LoginUser } from 'src/@shared/models';
import { WorkerCentralSummary } from '../core/models/workercentralsummary'
import icCheckCircle from '@iconify/icons-ic/twotone-check-circle';
import { ApexOptions } from 'src/@cv/components/chart/chart.component';
import { defaultChartOptions } from 'src/@cv/utils/default-chart-options';
import { createDateArray } from 'src/@cv/utils/create-date-array';

@Component({
  selector: 'cv-workercentral-dashboard',
  templateUrl: './workercentral-dashboard.component.html',
  styleUrls: ['./workercentral-dashboard.component.scss']
})
export class WorkercentralDashboardComponent implements OnInit {
  icMoreVert = icMoreVert;
  icGroup=icGroup;
  icPageView=icPageView;
  icCloudOff=icCloudOff;
  icTimer=icTimer;
  loginUser: LoginUser;
  applicantSummary:WorkerCentralSummary;
  MyApplicants:any;
  AllApplicants:any;
  Welcometitle:string;
  ApplicantsProcessingRate:number=0;
  icCheckCircle=icCheckCircle;
  dashboardNvigateUrl:string="";
 
  @Input() series: ApexNonAxisChartSeries | ApexAxisChartSeries;
 
  @Input() options: ApexOptions = defaultChartOptions({
    grid: {
      show: true,
      strokeDashArray: 3,
      padding: {
        left: 16
      }
    },
    chart: {
      type: 'line',
      height: 300,
      sparkline: {
        enabled: false
      },
      zoom: {
        enabled: false
      }
    },
    stroke: {
      width: 4
    },
    labels: createDateArray(12),
    xaxis: {
      type: 'datetime',
      labels: {
        show: true
      }
    },
    yaxis: {
      labels: {
        show: true
      }
    }
  });

  constructor(private _alertService: AlertService,
    private _jobcentralService: PlacementService,
    private _authService: AuthenticationService,
    private cdr:ChangeDetectorRef) { 
      this.applicantSummary = new WorkerCentralSummary();
    }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if(this.loginUser){
      this.Welcometitle = 'Hello '+this.loginUser.FirstName+' !';
      this.getWorkerCentralCentralSummary();
    }
  }

  getWorkerCentralCentralSummary(){
    const dsparams={
      UserId:this.loginUser.UserId,
      CompanyId:this.loginUser.Company.Id,
      Duration:8 //LAST WEEK
    }
    this._jobcentralService.GetWorkerCentralSummary(dsparams)
    .subscribe(
      result => {
        if (result.Data!=null) {
          this.applicantSummary = result.Data;
        }
        if(!this.cdr["distroyed"]){
          this.cdr.detectChanges();
        }
      },
      error => {
        this._alertService.error(error);
        if(!this.cdr["distroyed"]){
          this.cdr.detectChanges();
        }
      }
    );
  }

}
