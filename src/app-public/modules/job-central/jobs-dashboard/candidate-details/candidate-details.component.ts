import { Component, OnInit, Output, EventEmitter, Input, OnDestroy, OnChanges, SimpleChange, ChangeDetectorRef } from '@angular/core';
import icEye from '@iconify/icons-ic/twotone-remove-red-eye';
import icCloudDownload from '@iconify/icons-ic/twotone-cloud-download';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icBack from '@iconify/icons-ic/twotone-arrow-back';
import icPrint from '@iconify/icons-ic/twotone-print';
import icDownload from '@iconify/icons-ic/twotone-cloud-download';
import icInfo from '@iconify/icons-ic/twotone-info';
import iclocationon from '@iconify/icons-ic/location-on';
import { BenchCandidate } from '../../core/model/benchcandidate';
import icPersonAdd from '@iconify/icons-ic/twotone-person-add';
import icDoneAll from '@iconify/icons-ic/twotone-done-all';
import { MatDialog } from '@angular/material/dialog';
import { AlertService, AuthenticationService, TimeZoneService } from 'src/@shared/services';
import { LoginUser } from 'src/@shared/models';
import { SubUsers } from 'src/@shared/models/common/subusers';
import icschedule from '@iconify/icons-ic/schedule';
import icBook from '@iconify/icons-ic/twotone-book';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { JobCentralService } from '../../core/http/job-central.service';
import { Subscription } from 'rxjs';
//import { ViewResumeComponent } from 'src/app-ats/talent-central/bench-candidates/view-resume/view-resume.component';
import * as FileSaver from 'file-saver';
import { MarketingDashboardService } from 'src/@shared/core/ats/http/marketingdashboard.service';


@Component({
  selector: 'cv-candidate-details',
  templateUrl: './candidate-details.component.html',
  styleUrls: ['./candidate-details.component.scss'],
  providers: [JobCentralService,MarketingDashboardService]
})
export class CandidateDetailsComponent implements OnInit {
  @Input() selectedCandidateId: BenchCandidate;

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
  icBook = icBook;

  loginUser: LoginUser;
  public status_textClass: any = 'text-amber-contrast';
  public status_bgClass: any = 'bg-amber';

  public priority_textClass: any = 'text-warn';
  public priority_bgClass: any = 'bg-warn-light';
  public benchSubUsers: SubUsers[];
  AssignToNames: string[] = [];

  @Output('closeCandidate') public closeDetails: EventEmitter<boolean> = new EventEmitter<boolean>();
  public keywordsText: string[];
  public CertificationsText: string[];
  public hashtags: string[];
  public SelectedCandidate: BenchCandidate = new BenchCandidate();
  candidateunsubcribe: Subscription;
  constructor(private dialog: MatDialog,
    private _service: JobCentralService,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private matIconRegistry: MatIconRegistry,
    private domSanitzer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private _mktService:MarketingDashboardService
  ) {
    this.keywordsText = [];
    this.CertificationsText = [];
    this.matIconRegistry.addSvgIcon(
      'linkedin',
      this.domSanitzer.bypassSecurityTrustResourceUrl('assets/img/demo/rounded_linkedin.svg')
    );
    this.matIconRegistry.addSvgIcon('disable-linkedin', this.domSanitzer.bypassSecurityTrustResourceUrl('assets/img/demo/rounded_linkedin-disable.svg'));

  }

  ngOnInit() {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
    }
  }
  ngOnChanges(...args: any[]) {
    this.loginUser = this._authService.getLoginUser();
    this.getCandidate();
    if (!this.cdr["destroyed"]) {
      this.cdr.detectChanges();
    }
  }

  OnCloseDetail() {
    this.closeDetails.emit(true);
  }

  getCandidate() {
    this._service.getBenchCandidateById(this.loginUser.Company.Id, this.selectedCandidateId.CandidateID)
      .subscribe(response => {
        if (response.IsError == false) {
          this.SelectedCandidate = response.Data;
          this.SelectedCandidate.PrimaryPhoneNumber = this.PhoneValid(this.SelectedCandidate.PrimaryPhoneNumber);
          if (this.SelectedCandidate.City != null && this.SelectedCandidate.State != null) {
            this.SelectedCandidate.Location = this.SelectedCandidate.City + ", " + this.SelectedCandidate.State;
          }
          else {
            this.SelectedCandidate.Location = "-Not Specified-";
          }

          this.SelectedCandidate.UpdatedDate = TimeZoneService.getRelativeTime(this.SelectedCandidate.UpdatedDate, true);
          if (this.SelectedCandidate.Skillset) {
            this.keywordsText = this.SelectedCandidate.Skillset.split(",");
          }
          else {
            this.keywordsText = [];
          }

          if (this.SelectedCandidate.HashTags)
            this.hashtags = this.SelectedCandidate.HashTags.split(',');
          else
            this.hashtags = [];

          if (this.SelectedCandidate.Certifications) {
            this.CertificationsText = this.SelectedCandidate.Certifications.split(',');
          }
          else {
            this.CertificationsText = [];
          }

          if (this.SelectedCandidate.Assigned_To) {
            this.SelectedCandidate.Assigned_To.forEach(item => {
              let currentiem = this.benchSubUsers.find(x => x.UserId == item)
              this.AssignToNames.push(currentiem.FullName);
            });

          }

        }
        if (!this.cdr["destroyed"]) {
          this.cdr.detectChanges();
        }
      }, error => {
        this._alertService.error(error);
        if (!this.cdr["destroyed"]) {
          this.cdr.detectChanges();
        }
      });
  }
  ViewResume() {
    // if (this.SelectedCandidate.ResumePathKey) {
    //   this.dialog.open(ViewResumeComponent, {
    //     data: this.SelectedCandidate, width: '60%'
    //   }).afterClosed().subscribe(response => {

    //     if (response) {

    //     }
    //   });
    // }
    // else {
    //   this._alertService.error("Resume is  not available for this candidate.");
    // }
  }
  downloadResume() {
    if (this.SelectedCandidate.ResumePathKey) {
      const FileInfo = {
        FileName: this.SelectedCandidate.UploadedFileName,
        FilePathkey: this.SelectedCandidate.ResumePathKey,
        CompanyId: this.loginUser.Company.Id,
        FilePathBucket: this.SelectedCandidate.ResumePathBucket
      }
      this._service.downloadCandidateAttachment(FileInfo)
        .subscribe(response => {
          let filename = this.SelectedCandidate.UploadedFileName;
          FileSaver.saveAs(response, filename);
        }),
        error => {
          this._alertService.error("Error while downloading the file.");
        }
    }
    else {
      this._alertService.error("Resume is  not available for this candidate.");
    }
  }
 
  FormatCandidateData() {
    
    //this.selectedCandidateId = this.SelectedCandidate.CandidateID;
    this.CertificationsText = this.SelectedCandidate.Certifications ? this.SelectedCandidate.Certifications.split(",") : [];
    this.keywordsText = this.SelectedCandidate.Skillset ? this.SelectedCandidate.Skillset.split(",") : [];
    this.hashtags = this.SelectedCandidate.HashTags ? this.SelectedCandidate.HashTags.split(',') : [];
  }

  private PhoneValid(phone) {
    //normalize string and remove all unnecessary characters
    if (phone) {
      phone = phone.replace(/[^\d]/g, "");
      //check if number length equals to 10
      if (phone.length == 10) {
        //reformat and return phone number
        return phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
}
