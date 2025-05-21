import { ChangeDetectorRef, Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AlertService, AuthenticationService, TimeZoneService } from 'src/@shared/services';
import { LoginUser } from 'src/@shared/models';
import { FormBuilder, FormControl } from '@angular/forms';
import { JobCentralService } from '../../core/http/job-central.service';
import { EmitterService } from 'src/@cv/services/emitter.service';
import { JobBoardResponsesNotes } from '../../core/model/jobboardresponsesnotes';
import { FileAttachmentResponse } from 'src/@shared/models/fileattachmentresponse';
import icPictureAsPdf from '@iconify/icons-ic/twotone-picture-as-pdf';
import * as FileSaver from 'file-saver';
import { IconService } from 'src/@shared/services/icon.service';
import { ApplicantAttachmentViewComponent } from '../../JC-Common/applicant-attachment-view/applicant-attachment-view.component';
import { RequisitionNotes } from '../../core/model/requisitionsNotes';
import { RequisitionService } from '../../core/http/requisitions.service';

@Component({
  selector: 'cv-requisition-notes-dialog',
  templateUrl: './requisition-notes-dialog.component.html',
  styleUrls: ['./requisition-notes-dialog.component.scss']
})
export class RequisitionNotesDialogComponent implements OnInit {

  commentCtrl = new FormControl();
  loginUser: LoginUser;
  NotesList: RequisitionNotes[];
  currentSchedueNotes: RequisitionNotes;
  form: any;
  candidateId:number=0;
  applicantId:number=0;
  inputsrc:string=null;
  IsFileLoading:boolean = false;
  fileUploadLoading:boolean=false;
  isFileUploaded:boolean=false;
  fileUploadResponse: FileAttachmentResponse;
  IsSuccess:boolean=false;
  icPictureAsPdf=icPictureAsPdf;
  IsHeaderVisible:boolean;
 
  @Input() Input_Id: number;
  constructor(@Optional() @Inject(MAT_DIALOG_DATA)  private dialogData: { applicantId: number,mode:string }, //@Inject(MAT_DIALOG_DATA
    //private dialogRef: MatDialogRef<RequisitionNotesDialogComponent>,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private cdRef: ChangeDetectorRef,
    public iconService: IconService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private service: RequisitionService,
    private jobCentralService: JobCentralService,) { 
      this.NotesList = [];
      this.currentSchedueNotes = new RequisitionNotes();
      this.fileUploadResponse = new FileAttachmentResponse();
    }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {debugger;
      this.applicantId = this.Input_Id || (this.dialogData ? this.dialogData.applicantId : null);
      if (this.dialogData.mode=="Edit Requisition") {
        this.IsHeaderVisible = false;
      }
      else {
        this.IsHeaderVisible = true;
      }
      this.LoadExistingNotes();
    }
  }

  LoadExistingNotes(){
    if(this.applicantId > 0){
      this.GetApplicantNotes(this.applicantId,this.loginUser.Company.Id);
    }
  }

  GetApplicantNotes(responseId: number,companyId:number) {
    this.service.GetNotes(responseId,companyId)
      .subscribe(response => {debugger;
        if (response.IsError == false) {
          this.NotesList = response.Data;
          this.NotesList.forEach(element => {
            element.CreatedDate = TimeZoneService.getLocalDateTimeShort(element.CreatedDate, true);
          });
        }
        else {
          this._alertService.error(response.ErrorMessage);
        }
      },
        error => {
          this._alertService.error(error);
        });
  }

 

  addComment() {
    if (!this.commentCtrl.value && !this.fileUploadResponse.FilePathKey) {
      return;
    }
    this.currentSchedueNotes.RequisitionId = this.applicantId;
    this.currentSchedueNotes.Comment = this.commentCtrl.value;
    this.currentSchedueNotes.CreatedBy = this.loginUser.UserId;
    this.currentSchedueNotes.CompanyId = this.loginUser.Company.Id;

    if(this.fileUploadResponse.FileName != null){
      this.currentSchedueNotes.FileName = this.fileUploadResponse.FileName;
      this.currentSchedueNotes.FilePathKey = this.fileUploadResponse.FilePathKey;
      this.currentSchedueNotes.IsFile=true;
    }else
    {
      this.currentSchedueNotes.FileName = null;
      this.currentSchedueNotes.FilePathKey = null;
      this.currentSchedueNotes.IsFile=false;
    }

    this.service.SaveNotes(this.currentSchedueNotes)
      .subscribe(response => {
        this.LoadExistingNotes();
        this._alertService.success("Notes has been added Successfully");
        this.currentSchedueNotes = new RequisitionNotes();
        this.fileUploadResponse=new FileAttachmentResponse();
        this.fileUploadLoading = false;
        this.isFileUploaded = false;
        this.IsFileLoading = false;
        
        this.commentCtrl.setValue(null);
        this.UpdateNotesCount();

        if (!this.cdRef["distroyed"]) {
          this.cdRef.detectChanges();
        }
      },
        error => {
          this._alertService.error(error);
        });
  }

  UpdateNotesCount() {
    
  }



  handleKeyEvent(event,value){
    console.log( "Event (%s): %s", event.type, value );
    var inputValue = (<HTMLInputElement>document.getElementById("incomment")).value;
    inputValue += '\r\n';
  }

  onFileSelected(event){debugger;
    this.IsFileLoading = true;
    this.fileUploadLoading = true;
    var target = event.target || event.srcElement;
    let file = target.files;
    this.jobCentralService.uploadNotesAttachements(file,this.loginUser.Company.Id)
      .subscribe(response => {debugger;
        if (response.IsError) {
          this.fileUploadLoading = false;
          this.isFileUploaded = true;
          this.IsFileLoading = false;
          this.fileUploadResponse = response.Data;
          this._alertService.warning(response.ErrorMessage);
        } else {
          this.isFileUploaded = true;
          this.IsFileLoading = false;
          this.fileUploadResponse = response.Data;
        }

        if (!this.cdRef["distroyed"]) {
          this.cdRef.detectChanges();
        }
      },
        error => {
          this._alertService.error(error);
          this.fileUploadLoading = false;
          this.isFileUploaded = false;
          this.IsFileLoading = false;
        });

  }

  deleteFile(){
    this.fileUploadResponse=new FileAttachmentResponse();
    this.fileUploadLoading = false;
    this.isFileUploaded = false;
    this.IsFileLoading = false;
  }

  DownloadAttachemnt(row:JobBoardResponsesNotes){
    if (row.FileName) {
      const filedetails ={
        FileName:row.FileName,
        FilePathkey:row.FilePathKey,
        CompanyId:this.loginUser.Company.Id
      }
      this.jobCentralService.downloadNotesAttachment(filedetails)
        .subscribe(response => {
          let filename = row.FileName;
          FileSaver.saveAs(response, filename);
        }),
        error => {
          this._alertService.error("Error while downloading the file.");
        }
    }
    else
    {
      this._alertService.error("Resume is  not available for this candidate.");
    }
  }

  ViewAttachment(row:JobBoardResponsesNotes){
    if (row.FileWebPath) {debugger;
      this.dialog.open(ApplicantAttachmentViewComponent, {
        data:row.FileWebPath , width: '60%'
      }).afterClosed().subscribe(response => {

      });
    }
    else {
      this._alertService.error("Attachment is not available.");
    }
  }

  ViewAttachedFile(){
    if (this.fileUploadResponse.FilePathKey) {
      this.dialog.open(ApplicantAttachmentViewComponent, {
        data:this.fileUploadResponse.FileLocation+'/'+this.fileUploadResponse.FilePathKey , width: '60%'
      }).afterClosed().subscribe(response => {

      });
    }
    else {
      this._alertService.error("Attachment is not available.");
    }
  }

}
