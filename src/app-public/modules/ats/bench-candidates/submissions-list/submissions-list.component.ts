import { Component, OnInit, TemplateRef, Output, EventEmitter, Input,ChangeDetectorRef } from '@angular/core';
import { trackById } from 'src/@cv/utils/track-by';
import icNotifications from '@iconify/icons-ic/twotone-notifications';
import icInsertComment from '@iconify/icons-ic/twotone-insert-comment';
import icAttachFile from '@iconify/icons-ic/twotone-attach-file';
import { MatDialog } from '@angular/material/dialog';
import { filter, map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import icAdd from '@iconify/icons-ic/twotone-add';
import { PopoverService } from 'src/@cv/components/popover/popover.service';
import icClose from '@iconify/icons-ic/twotone-close';
import { FormControl } from '@angular/forms';
import icStar from '@iconify/icons-ic/twotone-star';
import icStarBorder from '@iconify/icons-ic/twotone-star-border';
import { stagger80ms } from 'src/@cv/animations/stagger.animation';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { fadeInRight400ms } from 'src/@cv/animations/fade-in-right.animation';
import { scaleIn400ms } from 'src/@cv/animations/scale-in.animation';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import icWork from '@iconify/icons-ic/twotone-work';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import icShare from '@iconify/icons-ic/twotone-share';
import icFavorite from '@iconify/icons-ic/twotone-favorite';
import icEdit from '@iconify/icons-ic/twotone-edit';
import {SubmissionService} from '../../core/http/submissions.service';
import { BenchCandidateService } from '../bench-candidates.service';
import { SubmissionsVM } from '../../core/models/submissionsvm';
import { TimeZoneService } from 'src/@shared/services/timezone.service';
import iclocationon from '@iconify/icons-ic/location-on';
import icschedule from '@iconify/icons-ic/schedule';
import icJob from '@iconify/icons-ic/assignment';
import icKeyboard_Arrow_Down from '@iconify/icons-ic/keyboard-arrow-down';
import icKeyboard_Arrow_Up from '@iconify/icons-ic/keyboard-arrow-up';
import icCompany from '@iconify/icons-ic/twotone-business';
import icDollar from '@iconify/icons-ic/attach-money';
import {
  AUTO_STYLE,
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { EditSubmitComponent } from '../edit-submit/edit-submit.component';
import { LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService, EventEmitterService } from 'src/@shared/services';
import { MatSelectChange } from '@angular/material/select';
import { MaterSubmissionStatus } from '../../core/models/matersubmissionstatus';
import { AddInterviewComponent } from '../../submissions/add-interview/add-interview.component';
import { MigrateConfirmationComponent } from '../../submissions/migrate-confirmation/migrate-confirmation.component';
import { NgxPermissionsService } from 'ngx-permissions';
import { isNullOrUndefined } from 'src/@shared/services/helpers';
import {UserModules,UserRoles} from 'src/@cv/models/accounttypeenum';
import { QuickSubmitComponent } from '../quick-submit/quick-submit.component';
import { EmitterService } from 'src/@cv/services/emitter.service';


const DEFAULT_DURATION = 300;

@Component({
  selector: 'cv-submissions-list',
  templateUrl: './submissions-list.component.html',
  styleUrls: ['./submissions-list.component.scss'],
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
  providers: [BenchCandidateService, TimeZoneService]
})
export class SubmissionsListComponent implements OnInit {

  @Input() CandidateId;
  @Input() IsMode;
  @Input() CandidateName;
  public benchCanSubmissions: SubmissionsVM[] = [];
  static nextId = 100;
  loginUser: LoginUser;
  selectedSubmission:SubmissionsVM;
  fadollarsign="fa-dollar-sign";
  public SubmissionStatusList: MaterSubmissionStatus[];

  

  collapsed = true;
  toggle() {
    this.collapsed = !this.collapsed;
  }
  expand(selectedSubmission:SubmissionsVM) {
    this.selectedSubmission=selectedSubmission;
    this.collapsed = false;
  }
  collapse() {
    this.collapsed = true;
  }

  @Output() public CloseQuickPopup: EventEmitter<boolean> = new EventEmitter<boolean>();

  addCardCtrl = new FormControl();
  addListCtrl = new FormControl();

  trackById = trackById;
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
  icDollar=icDollar;

  public IsEditSubmission: boolean = false;
  public IsInterviewList: boolean = false;
  public IsMainCard: boolean = true;
  public status_textClass: any = 'text-amber-contrast';
  public status_bgClass: any = 'bg-amber';
  public subtype_textClass: any = 'text-cyan-contrast';
  public subtype_bgClass: any = 'bg-cyan';
  MigrationPermission:boolean=false;

  constructor(private dialog: MatDialog,
    private route: ActivatedRoute,
    private popover: PopoverService,
    private _service: SubmissionService,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private cdr: ChangeDetectorRef,
    private _eventemitterservice:EventEmitterService,
    private permissionsService: NgxPermissionsService) {
    this.benchCanSubmissions = [];
    this.SubmissionStatusList = [];
  }
  
  ngOnInit() {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.getSubmissionStatusList(this.loginUser.Company.Id);
      this.GetSubmissions(this.loginUser.Company.Id, this.CandidateId, this.loginUser.UserId);
      this.CheckConvertToConfirmationPermission();
    }
    this._eventemitterservice.submissionUpdateEvent.subscribe(()=>{
      this.GetSubmissions(this.loginUser.Company.Id, this.CandidateId, this.loginUser.UserId);
    })

  }
  
  ngOnChanges(...args:any[]) {
    this.loginUser = this._authService.getLoginUser();
    this.GetSubmissions(this.loginUser.Company.Id, this.CandidateId, this.loginUser.UserId);
  }

  GetSubmissions(CompanyId: number, CandidateId: number, userId: string) {
    this._service.GetSubmissionsByCandidate(CompanyId, CandidateId, userId)
      .subscribe(response => {
        if(response.IsError==false){
          this.benchCanSubmissions = response.Data;
          this.benchCanSubmissions.forEach(
            jb => {
              //jb.Location = !isNullOrUndefined(jb.Location)?jb.Location : '--Not Defined--';
              jb.UpdatedDate = TimeZoneService.getLocalDateTime_Submission(jb.UpdatedDate, true);
              jb.ActivityLogs.forEach(
                log =>{
                  log.CreatedDate = TimeZoneService.getLocalDateTime(log.CreatedDate, true);
                }
              )
            });
            if (!this.cdr["distroyed"]) {
              this.cdr.detectChanges();
            }
        }
        else{
          this._alertService.error(response.ErrorMessage);
        }
      }, error => {
        this._alertService.error(error);
      });
  }


  Onclose() {
    this.IsEditSubmission = false;
    this.IsInterviewList = false;
    this.CloseQuickPopup.emit(true);

  }
  OnEditSubmission(CurrentSubmission: SubmissionsVM) {
    this.dialog.open(QuickSubmitComponent, {
      data:{candidateId:0,submissionId:CurrentSubmission.SubmissionID,srcmode:'edit'},width: '80%',disableClose: true
    }).afterClosed().subscribe(response => {
      if (response) {
        this.GetSubmissions(this.loginUser.Company.Id, this.CandidateId, this.loginUser.UserId);
      }
    });
  }

  CloseEditSubmission(event) {
    //on closing submission edit panel
    this.IsMainCard = true;
    this.IsEditSubmission = false;
    this.IsInterviewList = false;
  }

  onLabelChange(CurrentSubmission:SubmissionsVM ,change: MatSelectChange){
    const index = this.benchCanSubmissions.findIndex(c => c === CurrentSubmission);
    var selectedStatus = change.value;
    this.benchCanSubmissions[index].StatusName = selectedStatus.StatusName;
    this.benchCanSubmissions[index].status = selectedStatus.StatusId;
    const Psubmission = {
      SubmissionID: CurrentSubmission.SubmissionID,
      CompanyId: this.loginUser.Company.Id,
      Status: selectedStatus.StatusId,
      UpdatedBy: this.loginUser.UserId
    };
    this._service.UpdateSubmissionStatus(Psubmission)
      .subscribe(
        response => {
          if(response.IsError==false){
            if(selectedStatus.StatusName=="Confirmed" && this.MigrationPermission){

              const Migrationsubmission = {
                SubmissionID: CurrentSubmission.SubmissionID,
                JobId:CurrentSubmission.JobID,
                CandidateId:CurrentSubmission.CandidateID,
                CompanyId: this.loginUser.Company.Id,
                UpdatedBy: this.loginUser.UserId
              };

              this.dialog.open(MigrateConfirmationComponent, {
                data: Migrationsubmission, width: '60%'
              }).afterClosed().subscribe(response => {
                if (response) {
                 
                }
              });
            }
            else
            {
              this._alertService.success(response.SuccessMessage);
            }
            this.GetSubmissions(this.loginUser.Company.Id, this.CandidateId, this.loginUser.UserId);
          }
          
        },
        error => {
          this._alertService.error(error);
        }
      );
    
  }

  getSubmissionStatusList(CompanyId: number) {
    this._service.GetSubmissionStatusList(CompanyId)
      .subscribe(response => {
        if(response.IsError==false)
        this.SubmissionStatusList = response.Data;
      },
        error => {
          this._alertService.error(error); 
        }
      );
  }

  addInterview(CurrentSubmission: SubmissionsVM){
    const Intvsubmission = {
      SubmissionID: CurrentSubmission.SubmissionID,
      CandidateId: CurrentSubmission.CandidateID,
      ScheduleId:0,
    };
    this.dialog.open(AddInterviewComponent, {
      data: Intvsubmission, width: '60%',disableClose: true
    }).afterClosed().subscribe(response => {
      if (response) {
        this.GetSubmissions(this.loginUser.Company.Id, this.CandidateId, this.loginUser.UserId);
      }
    });
  }

  CheckConvertToConfirmationPermission(): boolean {
    var ModulesList = this.loginUser.ModulesList;
    let ATSModule = this.loginUser.ModulesList.find(x => x.ModuleId == UserModules.TalentCentral && x.HasAccess == true);
    let WCModule = this.loginUser.ModulesList.find(x => x.ModuleId == UserModules.WorkerCentral && x.HasAccess == true);
    if (WCModule && ATSModule) {
      if (ATSModule.RoleId == UserRoles.Administrator || ATSModule.RoleId == UserRoles.SalesManager) {
        this.MigrationPermission=true;
        return true;
      }
    }

    return false;
  }



}
