import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { UntilDestroy } from '@ngneat/until-destroy';
import { TimeZoneService } from 'src/@shared/services/timezone.service';
import { LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { JobMaster } from '../core/model/jobmaster';
import { BenchCandidate } from 'src/@shared/core/ats/models/benchcandidate';
import { MatDialog } from '@angular/material/dialog';
import { AddJobComponent } from './add-job/add-job.component';
import { EmitterService } from 'src/@cv/services/emitter.service';
import { MatTabChangeEvent } from '@angular/material/tabs';

@UntilDestroy()

@Component({
  selector: 'cv-jobs-dashboard',
  templateUrl: './jobs-dashboard.component.html',
  styleUrls: ['./jobs-dashboard.component.scss'],
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
export class JobsDashboardComponent implements OnInit {
  loginUser: LoginUser;
  public selectedJobId: number;
  public isJobsTable: boolean = true;
  IsJobDetail: boolean = false;
  IsRequistionDetail:boolean = false;
  public IscandidateDetail: boolean = false;
  selectedJob = new JobMaster();
  candidate: BenchCandidate = new BenchCandidate();
  dataChange: boolean = false;
  index: number = 0;
  isActiveJobs:boolean = true;
  isInactvieJobs:boolean=false;
  constructor(
    private _authService: AuthenticationService,
    private cdRef: ChangeDetectorRef,
    private dialog: MatDialog,
  ) {
  }
  ngOnInit() {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      EmitterService.get("JobCentral").emit("JobCentral");
    }
  }
  onViewJobChange(row: JobMaster) {
    this.IsJobDetail = true;
    this.isJobsTable = false;
    this.selectedJobId = row.JobID;
    this.selectedJob = row;
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }
  onBackClick() {
    this.IsJobDetail = false;
    this.isJobsTable = true;
    this.selectedJobId = 0;
    this.selectedJob = new JobMaster();
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }
  onCandidateClick(candidate) {
    this.candidate = candidate;
    this.IsJobDetail = false;
    this.IscandidateDetail = true;
    this.isJobsTable = false;
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }
  onCloseClick(event) {
    this.IsJobDetail = false;
    this.IscandidateDetail = false;
    this.isJobsTable = true;
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }
  onAddJobClick() {
    this.dialog.open(AddJobComponent, {
      maxWidth: '95vw', width: '95vw', disableClose: true, data: { mode: "Add Job", Id: 0 }
    }).afterClosed().subscribe(response => {
      if (response) {
        this.dataChange = true;
      }
    });
  }
  onEditClick(id) {
    this.dialog.open(AddJobComponent, {
      maxWidth: '95vw', width: '95vw', disableClose: true, data: { mode: "Edit Job", Id: id }
    }).afterClosed().subscribe(response => {

      if (response) {

      }
    });
  }

  onTabChanged(event: MatTabChangeEvent) {
    if (event.index === 0) {
      this.isActiveJobs = true;
      this.isInactvieJobs = false;
    } else if (event.index === 1) {
      this.isActiveJobs = false;
      this.isInactvieJobs = true;
    } 
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }

  onViewRequisition(row: JobMaster){
    this.IsJobDetail = false;
    this.isJobsTable = false;
    this.IsRequistionDetail=true;
    this.selectedJobId = row.JobID;
    this.selectedJob = row;
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }
}
