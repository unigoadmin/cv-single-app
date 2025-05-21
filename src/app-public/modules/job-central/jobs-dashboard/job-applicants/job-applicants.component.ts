
import { Component, Input, OnInit, ViewChild, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { stagger80ms } from 'src/@cv/animations/stagger.animation';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { fadeInRight400ms } from 'src/@cv/animations/fade-in-right.animation';
import { scaleIn400ms } from 'src/@cv/animations/scale-in.animation';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { SelectionModel } from '@angular/cdk/collections';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { FormControl } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';
import { BenchCandidate } from '../../core/model/benchcandidate';
import { MatDialog } from '@angular/material/dialog';
import { BenchPriorityLabels } from 'src/static-data/aio-table-data';
import icEdit from '@iconify/icons-ic/twotone-edit'
import icAdd from '@iconify/icons-ic/twotone-add';
import iclocationon from '@iconify/icons-ic/location-on';
import icNotifications from '@iconify/icons-ic/twotone-notifications';
import icInsertComment from '@iconify/icons-ic/twotone-insert-comment';
import icAttachFile from '@iconify/icons-ic/twotone-attach-file';
import icClose from '@iconify/icons-ic/twotone-close';
import icStar from '@iconify/icons-ic/twotone-star';
import icStarBorder from '@iconify/icons-ic/twotone-star-border';
import icWork from '@iconify/icons-ic/twotone-work';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import icShare from '@iconify/icons-ic/twotone-share';
import icschedule from '@iconify/icons-ic/schedule';
import icJob from '@iconify/icons-ic/assignment';
import icKeyboard_Arrow_Down from '@iconify/icons-ic/keyboard-arrow-down';
import icKeyboard_Arrow_Up from '@iconify/icons-ic/keyboard-arrow-up';
import icCompany from '@iconify/icons-ic/twotone-business';
import icDollar from '@iconify/icons-ic/attach-money';
import icBook from '@iconify/icons-ic/twotone-book';
import icFavorite from '@iconify/icons-ic/twotone-favorite';
import icComment from '@iconify/icons-ic/twotone-comment';
import icPhone from '@iconify/icons-ic/twotone-phone';
import icMail from '@iconify/icons-ic/twotone-mail';
import { JobCentralService } from '../../core/http/job-central.service';
import { BenchCandidateSearch } from '../../core/model/benchsearchcandidate';
import { TimeZoneService } from 'src/@shared/services/timezone.service';
import { LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { NgxPermissionsService } from 'ngx-permissions';
import {
  AUTO_STYLE,
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { JobMaster } from '../../core/model/jobmaster';
import { EmitterService } from 'src/@cv/services/emitter.service';
import { JobboardResponses } from '../../core/model/jobboardresponses';
import icPerson from '@iconify/icons-ic/twotone-person';
import { ResponseViewComponent } from '../../jobboard-responses/response-view/response-view.component';

const DEFAULT_DURATION = 300;
@Component({
  selector: 'cv-job-applicants',
  templateUrl: './job-applicants.component.html',
  styleUrls: ['./job-applicants.component.scss'],
  animations: [
    stagger80ms,
    fadeInUp400ms,
    fadeInRight400ms,
    scaleIn400ms,
    stagger40ms,
    trigger('collapse', [
      state('false', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
      state('true', style({ height: '0', visibility: 'hidden' })),
      transition('false => true', animate(DEFAULT_DURATION + 'ms ease-in')),
      transition('true => false', animate(DEFAULT_DURATION + 'ms ease-out'))
    ])
  ],
  providers: [JobCentralService, TimeZoneService,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'standard'
      } as MatFormFieldDefaultOptions
    }
  ]
})
export class JobApplicantsComponent implements OnInit {
  @Input('selectedJob') selectedJob: JobMaster;
  @Output('candidate') selectedCan = new EventEmitter<JobboardResponses>();
  @Output('editClick') editCandidate = new EventEmitter<JobboardResponses>();
  icComment = icComment;
  candidates: JobboardResponses[] = [];
  mobileQuery: MediaQueryList;
  loginUser: LoginUser;
  selection = new SelectionModel<JobboardResponses>(true, []);
  searchCtrl = new FormControl();
  labels = BenchPriorityLabels;
  icNotifications = icNotifications;
  icInsertComment = icInsertComment;
  icAttachFile = icAttachFile;
  icAdd = icAdd;
  icClose = icClose;
  icStar = icStar;
  icStarBorder = icStarBorder;
  icWork = icWork;
  icMoreVert = icMoreVert;
  icShare = icShare;
  icFavorite = icFavorite;
  icEdit = icEdit;
  iclocationon = iclocationon;
  icschedule = icschedule;
  icJob = icJob;
  icCompany = icCompany;
  icKeyboard_Arrow_Down = icKeyboard_Arrow_Down;
  icKeyboard_Arrow_Up = icKeyboard_Arrow_Up;
  icDollar = icDollar;
  icPhone = icPhone;
  icMail = icMail;
  icBook = icBook;
  icPerson = icPerson;
  public status_textClass: any = 'text-amber-contrast';
  public status_bgClass: any = 'bg-amber';
  public subtype_textClass: any = 'text-cyan-contrast';
  public subtype_bgClass: any = 'bg-cyan';
  selectedSubmission: any;
  collapsed = true;
  public candidateName: string;
  public selectedCandidateId: number;
  public IsCandidateDetail: boolean = false;
  public selectedCandidate: BenchCandidate;
  public IsSubmissionsList: boolean = false;
  @ViewChild('quickpanel', { static: true }) quickpanel: MatSidenav;
  public candidateFilters: BenchCandidateSearch = new BenchCandidateSearch();
  activeApplicantId: number;
  constructor(private dialog: MatDialog,
    private _service: JobCentralService,
    private matIconRegistry: MatIconRegistry,
    private domSanitzer: DomSanitizer,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private cdRef: ChangeDetectorRef,
    private permissionsService: NgxPermissionsService,
  ) {
    this.matIconRegistry.addSvgIcon(
      'linkedin',
      this.domSanitzer.bypassSecurityTrustResourceUrl('assets/img/demo/rounded_linkedin.svg')
    );
    this.matIconRegistry.addSvgIcon('disable-linkedin', this.domSanitzer.bypassSecurityTrustResourceUrl('assets/img/demo/rounded_linkedin-disable.svg'));
    this.candidates = [];
  }
  _emitterappli = EmitterService.get("refreshappli");
  ngOnInit() {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.getData();
    }
    this._emitterappli.subscribe(result => {
      this.selectedJob = result;
      this.getData();
    })
  }


  getData() {
    const appFilter = {
      companyId: this.loginUser.Company.Id,
      UserId: this.loginUser.UserId,
      AssigneeId: this.loginUser.UserId,
      JobId: this.selectedJob,
      PageSize: 1000
    }
    this._service.GetApplicantsByJob(appFilter).subscribe(result => {
      if (result.IsError) {
        this._alertService.error(result.ErrorMessage);
      } else {
        if (result.Data.length > 0) {
          this.candidates = result.Data;
          this.candidates.forEach(element => {
            element.ActualDate = TimeZoneService.getRangeBaseTimeDisplay(element.ActualDate, true);
          });
        }
        this.onCardClick(this.candidates[0], 0);
      }
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    }, error => {
      this._alertService.error(error);
    });

  }
  updateCustomer(candidate: BenchCandidate) {
    this.IsSubmissionsList = true;
    this.IsCandidateDetail = true;
    this.selectedCandidateId = candidate.CandidateID;
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }
  toggle() {
    this.collapsed = !this.collapsed;
  }
  expand(selectedSubmission: any) {
    this.selectedSubmission = selectedSubmission;
    this.collapsed = false;
  }
  collapse() {
    this.collapsed = true;
  }
  onCnadidateClick(candidate) {
    this.selectedCan.emit(candidate);
  }
  EditClick(candidate) {
    this.editCandidate.emit(candidate);
  }

  onCardClick(item: JobboardResponses, index) {
    debugger;

    this.candidates.forEach(element => {
      element.IsSelected = false;
    });
    this.candidates[index].IsSelected = true;
    this.activeApplicantId = item.ResponseId;
    this.selectedCan.emit(item);
  }

  ViewApplicant(row: JobboardResponses) {

    this.dialog.open(ResponseViewComponent, {
      data: { ResponseId: row.ResponseId, Source: 'ACP' }, maxWidth: '95vw', width: '95vw', disableClose: true
    }).afterClosed().subscribe(response => {

      if (response) {
        // this.UpdateViewedStatus(this.loginUser.Company.Id, row.CandidateInboxId);
      }
    });

  }
}
