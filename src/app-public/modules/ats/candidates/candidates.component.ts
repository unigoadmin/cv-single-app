import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { UntilDestroy} from '@ngneat/until-destroy';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService, TimeZoneService } from 'src/@shared/services';
import { CandidateService } from '../core/http/candidates.service';
import { AccountTypes } from 'src/static-data/accounttypes';
import { ActivityLogCandidate } from '../core/models/candidateActivityLog';
import { MatSidenav } from '@angular/material/sidenav';
import { IconService } from 'src/@shared/services/icon.service';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { EmitterService } from 'src/@cv/services/emitter.service';


@UntilDestroy()
@Component({
  selector: 'cv-candidates',
  templateUrl: './candidates.component.html',
  styleUrls: ['./candidates.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
  providers: [TimeZoneService, AccountTypes,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'standard'
      } as MatFormFieldDefaultOptions
    }
  ]
})
export class CandidatesComponent implements OnInit {
  
  IsLoaded:boolean = false;
  IsTechScreenLoaded:boolean = false;
  IsMarketingLoaded:boolean = false;
  index: number = 0;
  selectedCandidateId:number;
  loginUser: LoginUser;
  ActivityLogs: ActivityLogCandidate[];
  currentPage = 0;
  totalRows = 0;
  isLoadpage:boolean=false;
  @ViewChild('activitylog', { static: true }) activitylog: MatSidenav;
  _refreshtabemitter = EmitterService.get("SetCandidateResponsesTabActive");
  @ViewChild('tabGroup', {static: false}) tab: MatTabGroup;

  constructor(private dialog: MatDialog,
    private _service: CandidateService,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private cdRef: ChangeDetectorRef,
    public iconService: IconService) {
    this.ActivityLogs = [];
    this.index=0;
    this.IsLoaded=true;
  }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.IsLoaded=true;
      this.getUnReadCounts(this.loginUser.Company.Id);
    }

    this._refreshtabemitter.subscribe(res => {
      this.index = Number(localStorage.getItem('candidateResponsesTabLocation') || 0);
      this.tab.selectedIndex=this.index;
    })

    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }

  getUnReadCounts(companyId: number) {
    // this._service.GetJobCentraLUnreadCount(companyId)
    //   .subscribe(
    //     jcSettingResponse => {
    //       if (jcSettingResponse.Data != null) {
    //         this.UnreadsCounts = jcSettingResponse.Data
    //       }
    //       if (!this.cdRef["distroyed"]) {
    //         this.cdRef.detectChanges();
    //       }
    //     },
    //     error => {
    //       this._alertService.error(error);
    //       if (!this.cdRef["distroyed"]) {
    //         this.cdRef.detectChanges();
    //       }
    //     }
    //   );
  }

  handleMatTabChange(event: MatTabChangeEvent) {
    if(event.index==0){
      this.IsLoaded=true;
    }
    else if(event.index==1){
      this.IsTechScreenLoaded=true;
    }
    else if(event.index==2){
      this.IsMarketingLoaded=true;
    }
    localStorage.setItem('candidateResponsesTabLocation', event.index.toString());
  }

  OnActiviyLogclose() {
    this.activitylog.close();
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }

  

}
