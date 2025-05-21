import { ChangeDetectorRef, Component, HostBinding, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { AlertService } from 'src/@shared/services';
import { CommonService } from 'src/@shared/http/common.service'; 
import { JobMaster } from 'src/@shared/models/common/jobmaster';
import { JobQuickApplyComponent } from '../job-quick-apply/job-quick-apply.component';
import { ConfigService } from 'src/@cv/services/config.service';
import { map } from 'rxjs/operators';
import { isNullOrUndefined } from 'src/@shared/services/helpers';

@Component({
  selector: 'cv-job-view',
  templateUrl: './job-view.component.html',
  styleUrls: ['./job-view.component.scss'],
  animations: [
    fadeInUp400ms
  ]
})
export class JobViewComponent implements OnInit {
  
  @Input() mobileQuery: boolean;

  @Input()
  @HostBinding('class.shadow-b')
  hasShadow: boolean;

  //navigationItems = this.navigationService.items;

  isHorizontalLayout$ = this.configService.config$.pipe(map(config => config.layout === 'horizontal'));
  isVerticalLayout$ = this.configService.config$.pipe(map(config => config.layout === 'vertical'));
  isNavbarInToolbar$ = this.configService.config$.pipe(map(config => config.navbar.position === 'in-toolbar'));
  isNavbarBelowToolbar$ = this.configService.config$.pipe(map(config => config.navbar.position === 'below-toolbar'));
  JobId:string;
  CompanyId:number;
  job: JobMaster = new JobMaster();
  sub: any;
  SelectedKwywods:any[];
  IsFormSubmitted:boolean=false;
  constructor(
    private configService: ConfigService,
    private dialog: MatDialog,
    private _commonService: CommonService,
    private _alertService: AlertService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {debugger;
    this.sub = this.route.params.subscribe(params => {
      this.CompanyId = params['CompanyId'].toString() || null;
      this.JobId = params['GeneratedJobId'].toString() || null;
    });
    this.getJobById();
  }

  getJobById() {
    this._commonService.GetBenchJobByPublishId(this.CompanyId,this.JobId).subscribe(response => {
      if (response.IsError) {
        this._alertService.error(response.ErrorMessage);
      } else {
        this.job = response.Data;
        // if (!isNullOrUndefined(this.job.JobPostingDate)) {
        //   this.JobPostingDate = new Date(moment(this.job.JobPostingDate).format("MM-DD-YYYY"));
        // }
        if (!isNullOrUndefined(this.job.SkillSet)) {
          this.SelectedKwywods = this.job.SkillSet.split(",");
        }
        // if (!isNullOrUndefined(this.job.WorkStatus) && this.job.WorkStatus.length > 0) {
        //   this.jobWorkStatus = this.job.WorkStatus.split(",")
        // }
      
      }
      if (!this.cdr["destroyed"]) {
        this.cdr.detectChanges();
      }
    }, error => {
      this._alertService.error(error);
      if (!this.cdr["destroyed"]) {
        this.cdr.detectChanges();
      }
    })
  }

  QuickApply(){
    this.dialog.open(JobQuickApplyComponent, {
      data: { CompanyId:this.CompanyId, JobId: this.JobId}, width: '60%', disableClose: true
    }).afterClosed().subscribe(response => {debugger;

      if (response==true) {
        this.IsFormSubmitted=true;
      }
    });
  }

}
