import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import icMoreHoriz from '@iconify/icons-ic/twotone-more-horiz';
import icCloudDownload from '@iconify/icons-ic/twotone-cloud-download';
import faCaretUp from '@iconify/icons-fa-solid/caret-up';
import faCaretDown from '@iconify/icons-fa-solid/caret-down';
import { ApexOptions } from 'src/@cv/components/chart/chart.component';
import { defaultChartOptions } from 'src/@cv/utils/default-chart-options';
import { Icon } from '@visurel/iconify-angular';
import { LoginUser } from 'src/@shared/models';
import { PlacementService } from '../../core/http/placement.service';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { WCHeadCount } from '../../core/models/workercentralHeadCount';

@Component({
  selector: 'cv-wc-headcount-chart',
  templateUrl: './wc-headcount-chart.component.html',
  styleUrls: ['./wc-headcount-chart.component.scss']
})
export class WcHeadcountChartComponent implements OnInit {
  
  @Input() value:any;
  @Input() icon: Icon;
  @Input() total: number;
  @Input() W2Value: number;
  @Input() C2CValue: number;
  @Input() label: string;
  @Input() iconClass: string;
  @Input() series: ApexNonAxisChartSeries | ApexAxisChartSeries;
  @Input() options :ApexOptions | ApexOptions;

  icMoreHoriz = icMoreHoriz;
  icCloudDownload = icCloudDownload;
  faCaretUp = faCaretUp;
  faCaretDown = faCaretDown;
  loginUser: LoginUser;
  plottingvalue:number[];
  wcheadcounts:WCHeadCount[]=[];
  plottingData:ApexAxisChartSeries;
  plottingLabels:any[]=[];

  constructor(private _alertService: AlertService,
    private _jobcentralService: PlacementService,
    private _authService: AuthenticationService,
    private cdr:ChangeDetectorRef) { 
      this.plottingvalue=[];
    }

  ngOnInit() {
    this.loginUser = this._authService.getLoginUser();
    if(this.loginUser){
      this.getWorkerCentralCentralHeadCount();
    }
  
  }

  getWorkerCentralCentralHeadCount(){
    const dsparams={
      UserId:this.loginUser.UserId,
      CompanyId:this.loginUser.Company.Id,
      Duration:8 //LAST WEEK
    }
    this._jobcentralService.GetWorkerCentralHeadCount(dsparams)
    .subscribe(
      result => {
        if (result.Data!=null) {
          this.wcheadcounts = result.Data;
          this.wcheadcounts.forEach(x=> {
            this.plottingvalue.push(x.value);
            this.plottingLabels.push(x.Month);
          });
          this.series = [{
            name: 'Workers',
            data: this.plottingvalue
          }];
          this.options = defaultChartOptions({
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
            labels: this.plottingLabels, //createDateArray(12),
            xaxis: {
              type: 'category',
              labels: {
                show: true
              }
            },
            yaxis: {
              labels: {
                show: true,
                formatter: function(val) {
                  return val.toFixed(0);
                }
              }
            }
          });

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


