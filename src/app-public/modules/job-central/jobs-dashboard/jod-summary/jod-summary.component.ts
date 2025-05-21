import { ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';
import icEye from '@iconify/icons-ic/twotone-remove-red-eye';
import icCloudDownload from '@iconify/icons-ic/twotone-cloud-download';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icBack from '@iconify/icons-ic/twotone-arrow-back';
import icPrint from '@iconify/icons-ic/twotone-print';
import icDownload from '@iconify/icons-ic/twotone-cloud-download';
import icInfo from '@iconify/icons-ic/twotone-info';
import iclocationon from '@iconify/icons-ic/location-on';
import icPersonAdd from '@iconify/icons-ic/twotone-person-add';
import icDoneAll from '@iconify/icons-ic/twotone-done-all';
import icschedule from '@iconify/icons-ic/schedule';
import icaccount from '@iconify/icons-ic/supervisor-account';
import icnote from '@iconify/icons-ic/note';
import { JobMaster } from '../../core/model/jobmaster';
import { LoginUser } from 'src/@shared/models';
import { JobCentralService } from '../../core/http/job-central.service';
import { AlertService, AuthenticationService } from 'src/@shared/services';

@Component({
  selector: 'cv-jod-summary',
  templateUrl: './jod-summary.component.html',
  styleUrls: ['./jod-summary.component.scss'],
  providers: [JobCentralService],
})
export class JodSummaryComponent implements OnInit,OnChanges {
  @Input('selectedJob') job: JobMaster;
  icEdit = icEdit;
  icCloudDownload = icCloudDownload;
  icEye = icEye;
  icBack = icBack;
  icPrint = icPrint;
  icDownload = icDownload;
  icInfo = icInfo;
  iclocationon = iclocationon;
  icPersonAdd = icPersonAdd;
  icDoneAll = icDoneAll;
  icschedule = icschedule;
  icAccount = icaccount;
  icnote = icnote
  public status_textClass: any = 'text-amber-contrast';
  public status_bgClass: any = 'bg-amber';
  loginUser: LoginUser;
  public priority_textClass: any = 'text-warn';
  public priority_bgClass: any = 'bg-warn-light';
  public keywordsText: string[];
  public hashtags: string[];
  constructor(
    private _service: JobCentralService,
    private _authService: AuthenticationService,
    private cdRef: ChangeDetectorRef,
    private _alertService: AlertService,
  ) { }
  ngOnInit() {
  }
ngOnChanges(...args:any[]){
  if (this.job.SkillSet) {
    this.keywordsText = this.job.SkillSet.split(",");
  }
  else {
    this.keywordsText = [];
  }
  if (this.job.Hashtags)
    this.hashtags = this.job.Hashtags.split(',');
  else
    this.hashtags = [];
}
}
