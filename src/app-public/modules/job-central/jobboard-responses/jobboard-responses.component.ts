import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { EmitterService } from 'src/@cv/services/emitter.service';
import { LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService, TimeZoneService } from 'src/@shared/services';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { isNullOrUndefined } from 'src/@shared/services/helpers';
import { JobCentralService } from '../core/http/job-central.service';
import { JobCentralSettings } from '../core/model/jobcentralsettings';
import { CandidateInboxUnReadCount } from '../core/model/CandidateInboxUnReadCount';
import { MatTabChangeEvent,MatTabGroup } from '@angular/material/tabs';

@UntilDestroy()
@Component({
  selector: 'cv-jobboard-responses',
  templateUrl: './jobboard-responses.component.html',
  styleUrls: ['./jobboard-responses.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
  providers: [TimeZoneService,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'standard'
      } as MatFormFieldDefaultOptions
    }
  ]
})
export class JobboardResponsesComponent implements OnInit {

  mobileQuery: MediaQueryList;
  loginUser: LoginUser;
  index: number = 0;
  Default: string = "true";
  InboxSourceValue: number;
  IsLoaded: boolean = false;
  
  LinkedInUnread: number = 0;
  DiceUnread: number = 0;

  IsActiveLoaded:boolean=false;
  IsLinkedLoaded:boolean=false;
  IsDiceLoaded:boolean=false;
  IsMonsterLoaded:boolean=false;
  IsIgnoredLoaded:boolean=false;
  IsTechScreenLoaded:boolean=false;
  IsMarketingLoaded:boolean=false;
  IsJobPostingLoaded:boolean=false;

  UnreadsCounts: CandidateInboxUnReadCount = new CandidateInboxUnReadCount();
  public jcSetting: JobCentralSettings = new JobCentralSettings();
  @ViewChild('tabGroup', {static: false}) tab: MatTabGroup;
  _refreshtabemitter = EmitterService.get("SetJobResponsesTabActive");
  constructor(
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private _jobcentralService: JobCentralService,
    private cdr: ChangeDetectorRef
  ) {
    this.Default = localStorage.getItem("Default");
    if (!isNullOrUndefined(this.Default) && this.Default != '') {
      if (this.Default === "true")
        this.index = 0;
      else
        this.index = 1;
    }
    this.IsLoaded = false;
  }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      //this.tab.selectedIndex=0;
      EmitterService.get("JobCentral").emit("JobCentral");
      this.getUnReadCounts(this.loginUser.Company.Id);
      this.getJobCentralSettings(this.loginUser.Company.Id);
    }

    this._refreshtabemitter.subscribe(res => {
      this.index = Number(localStorage.getItem('applicantResponsesTabLocation') || 0);
      this.tab.selectedIndex=this.index;
      console.log(this.index);
    })

    if (!this.cdr["distroyed"]) {
      this.cdr.detectChanges();
    }
  }

  getJobCentralSettings(companyId: number) {
    this._jobcentralService.GetJobCentralSettings(companyId)
      .subscribe(
        jcSettingResponse => {
          if (jcSettingResponse.Data != null) {
            this.jcSetting = jcSettingResponse.Data;
            this.InboxSourceValue = this.jcSetting.InboxSource;
            this.IsLoaded = true;
          }
          else {
            this.jcSetting = new JobCentralSettings();
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

  getUnReadCounts(companyId: number) {
    this._jobcentralService.GetJobCentraLUnreadCount(companyId)
      .subscribe(
        jcSettingResponse => {
          if (jcSettingResponse.Data != null) {
            this.UnreadsCounts = jcSettingResponse.Data
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

  handleMatTabChange(event: MatTabChangeEvent) {
    if(event.index==0){
      this.IsLoaded=true;
    }
    else if(event.index==1){
      this.IsLinkedLoaded=true;
    }
    else if(event.index==2){
      this.IsDiceLoaded=true;
    }
    else if(event.index==3){
      this.IsMonsterLoaded=true;
    }
    else if(event.index==4){
      this.IsJobPostingLoaded=true;
    }
    else if(event.index==5){
      this.IsIgnoredLoaded=true;
    }
    else if(event.index==6){
      this.IsTechScreenLoaded=true;
    }
    else if(event.index==7){
      this.IsMarketingLoaded=true;
    }
    localStorage.setItem('applicantResponsesTabLocation', event.index.toString());
  }
  ngAfterViewInit() {
    this.index = Number(localStorage.getItem('applicantResponsesTabLocation') || 0); // get stored number or zero if there is nothing stored
    //this.tabGroup.selectedIndex = index; // with tabGroup being the MatTabGroup accessed through ViewChild
  }

  ngOnDestroy(){
    localStorage.removeItem('applicantResponsesTabLocation');
  } 

}
