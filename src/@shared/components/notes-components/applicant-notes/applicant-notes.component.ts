import { ChangeDetectorRef, Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { IconService } from '../../../services/icon.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoginUser } from 'src/@shared/models';
import { ConfirmDialogModel } from 'src/@shared/models/confirmdialogmodel';
import { FileAttachmentResponse } from 'src/@shared/models/fileattachmentresponse';
import { JobBoardResponsesNotes } from 'src/@shared/models/jobboardresponsenotes';
import { AlertService, AuthenticationService, TimeZoneService } from 'src/@shared/services';
import { ConfirmDeleteDialogComponent } from '../../filter-components/confirm-delete-dialog/confirm-delete-dialog.component';
import { EmitterService } from 'src/@cv/services/emitter.service';
import * as FileSaver from 'file-saver';
import { NotesService } from 'src/@shared/services/notes.service';
import { AttachmentViewComponent } from '../attachment-view/attachment-view.component';


@Component({
  selector: 'cv-applicant-notes',
  templateUrl: './applicant-notes.component.html',
  styleUrls: ['./applicant-notes.component.scss']
})
export class ApplicantNotesComponent implements OnInit {

  applicantId: number = 0;
  commentCtrl = new FormControl();
  loginUser: LoginUser;
  NotesList: JobBoardResponsesNotes[];
  currentSchedueNotes: JobBoardResponsesNotes;
  form: any;
  IsFileLoading: boolean = false;
  fileUploadLoading: boolean = false;
  isFileUploaded: boolean = false;
  fileUploadResponse: FileAttachmentResponse;
  IsSuccess: boolean = false;
  btn_title: string = 'SUBMIT';
  DialogResponse: any;
  isSubmitting: boolean = false;
  IsHeaderVisible:boolean = false;
  private destroy$ = new Subject();

  @Input() Input_Id: number;
  constructor(@Optional() @Inject(MAT_DIALOG_DATA)
  private dialogData: { ResponseId: number, Notesmode: string },
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private cdRef: ChangeDetectorRef,
    private _notesservice: NotesService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    public iconService: IconService) {
    this.NotesList = [];
    this.currentSchedueNotes = new JobBoardResponsesNotes();
    this.fileUploadResponse = new FileAttachmentResponse();
  }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.applicantId = this.Input_Id || (this.dialogData ? this.dialogData.ResponseId : null);
      if (this.dialogData.Notesmode=="Dialog") {
        this.IsHeaderVisible = true;
      }
      else {
        this.IsHeaderVisible = false;
      }
      this.LoadExistingNotes();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  LoadExistingNotes() {
    this.GetApplicantNotes(this.applicantId);
  }

  GetApplicantNotes(applicantId: number) {
    const notesfiltervm = {
      ResponseId : applicantId,
      companyId : this.loginUser.Company.Id,
      loggedUserId: this.loginUser.UserId
    }
    this._notesservice.GetResponsesNotes(notesfiltervm)
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        if (response.IsError == false) {
          this.NotesList = response.Data;
          this.NotesList.forEach(element => {
            element.CreatedDate = TimeZoneService.getLocalDateTimeShort(element.CreatedDate, true);
          });
        }
        else {
          this._alertService.error(response.ErrorMessage);
        }
        this.cdRef.detectChanges();
      },
        error => {
          this._alertService.error(error);
        });
  }

  updateComment(){debugger;
    if (!this.commentCtrl.value && !this.fileUploadResponse.FilePathKey){
      return;
    }
    this.currentSchedueNotes.Comment = this.commentCtrl.value ? this.commentCtrl.value.trim() : this.commentCtrl.value;
    this.currentSchedueNotes.NotesAction="Update";
    this.currentSchedueNotes.UpdatedBy = this.loginUser.UserId;
    this.currentSchedueNotes.CreatedDate = new Date();
    this._notesservice.SaveResponseNotes(this.currentSchedueNotes)
      .subscribe(response => {
        this.LoadExistingNotes();
        this._alertService.success("Notes has been updated successfully");
        this.currentSchedueNotes = new JobBoardResponsesNotes();
        this.fileUploadResponse = new FileAttachmentResponse();
        this.fileUploadLoading = false;
        this.isFileUploaded = false;
        this.IsFileLoading = false;

        this.commentCtrl.setValue(null);
        this.setdefault(); 
        this.cdRef.detectChanges();
      },
        error => {
          this._alertService.error(error);
          this.isSubmitting = false; 
        });

  }

  addComment() {
    this.currentSchedueNotes.NotesAction="Insert";
    this.currentSchedueNotes.ResponseId = this.applicantId;
    this.currentSchedueNotes.Comment = this.commentCtrl.value ? this.commentCtrl.value.trim() : this.commentCtrl.value;
    this.currentSchedueNotes.CreatedBy = this.loginUser.UserId;
    this.currentSchedueNotes.CompanyId = this.loginUser.Company.Id;

    if (this.fileUploadResponse.FileName != null) {
      this.currentSchedueNotes.FileName = this.fileUploadResponse.FileName;
      this.currentSchedueNotes.FilePathKey = this.fileUploadResponse.FilePathKey;
      this.currentSchedueNotes.IsFile = true;
    } else {
      this.currentSchedueNotes.FileName = null;
      this.currentSchedueNotes.FilePathKey = null;
      this.currentSchedueNotes.IsFile = false;
    }

    this._notesservice.SaveResponseNotes(this.currentSchedueNotes)
      .subscribe(response => {
        this.LoadExistingNotes();
        this._alertService.success("Notes has been added Successfully");
        this.currentSchedueNotes = new JobBoardResponsesNotes();
        this.fileUploadResponse = new FileAttachmentResponse();
        this.fileUploadLoading = false;
        this.isFileUploaded = false;
        this.IsFileLoading = false;

        this.commentCtrl.setValue(null);
        this.setdefault(); 
        if (!this.cdRef["distroyed"]) {
          this.cdRef.detectChanges();
        }
      },
        error => {
          this._alertService.error(error);
          this.isSubmitting = false; 
        });
  }

  saveComment() {debugger;
    if ((!this.commentCtrl.value || !this.commentCtrl.value.trim()) && !this.fileUploadResponse.FilePathKey) {
      this._alertService.error("Please enter vlaid text.");
      return;
    }
    this.isSubmitting = true;
    if(this.currentSchedueNotes.ResponseNotesId > 0){
      this.updateComment();
    }
    else{
      this.addComment();
    }
  }

  UpdateNotesCount() {
    EmitterService.get("CanNotescnt").emit(this.applicantId);
  }

  handleKeyEvent(event, value) {
    console.log("Event (%s): %s", event.type, value);
    var inputValue = (<HTMLInputElement>document.getElementById("incomment")).value;
    inputValue += '\r\n';
  }

  onFileSelected(event) {
    this.IsFileLoading = true;
    this.fileUploadLoading = true;
    var target = event.target || event.srcElement;
    let file = target.files;
    this._notesservice.uploadNotesAttachements(file, this.loginUser.Company.Id)
      .subscribe(response => {
        debugger;
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

  deleteFile() {
    this.fileUploadResponse = new FileAttachmentResponse();
    this.fileUploadLoading = false;
    this.isFileUploaded = false;
    this.IsFileLoading = false;
  }

  DownloadAttachemnt(row: JobBoardResponsesNotes) {
    if (row.FileName) {
      const filedetails = {
        FileName: row.FileName,
        FilePathkey: row.FilePathKey,
        CompanyId: this.loginUser.Company.Id
      }
      this._notesservice.downloadNotesAttachment(filedetails)
        .subscribe(response => {
          let filename = row.FileName;
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

  ViewAttachment(row: JobBoardResponsesNotes) {
    if (row.FileWebPath) {
      debugger;
      this.dialog.open(AttachmentViewComponent, {
        data: row.FileWebPath, width: '60%'
      }).afterClosed().subscribe(response => {

      });
    }
    else {
      this._alertService.error("Attachment is not available.");
    }
  }

  ViewAttachedFile() {
    if (this.fileUploadResponse.FilePathKey) {
      this.dialog.open(AttachmentViewComponent, {
        data: this.fileUploadResponse.FileLocation + '/' + this.fileUploadResponse.FilePathKey, width: '60%'
      }).afterClosed().subscribe(response => {

      });
    }
    else {
      this._alertService.error("Attachment is not available.");
    }
  }

  // handleEnter(event: KeyboardEvent): void {
  //   if (event.key === 'Enter') {
  //     event.stopPropagation();
  //     }
  //   //event.preventDefault(); // Prevent the default behavior
  //   const textarea = event.target as HTMLTextAreaElement;
  //   const cursorPosition = textarea.selectionStart || 0;

  //   // Insert a newline character at the cursor position
  //   const newValue = textarea.value.slice(0, cursorPosition) + '\n' + textarea.value.slice(cursorPosition);
  //   textarea.value = newValue;

  //   // Move the cursor to the correct position
  //   textarea.selectionStart = textarea.selectionEnd = cursorPosition + 1;
  // }

  handleEnter(event: KeyboardEvent): void {
    // Allow the default Enter key behavior without custom logic
    if (event.key === 'Enter') {
      event.stopPropagation(); // Stops propagation but keeps the default behavior
    }
  }
  

  editComment(comment_row: JobBoardResponsesNotes): void {debugger;
    this.currentSchedueNotes = comment_row;
    this.commentCtrl.setValue(this.currentSchedueNotes.Comment);
    this.btn_title = "UPDATE";
  }

  deleteComment(comment_row: any) {
    const message = 'Selected notes will be deleted. If there is any attachment, this attachment will also be deleted. Do you want to proceed?'
    const dialogData = new ConfirmDialogModel("Applicant Notes", message);
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '60%',
      data: dialogData,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.DialogResponse = dialogResult;
      if (this.DialogResponse.Dialogaction == true) {
        this.currentSchedueNotes = comment_row;
        this.currentSchedueNotes.NotesAction = "Delete";
        this.currentSchedueNotes.CreatedDate = new Date();
        this._notesservice.SaveResponseNotes(this.currentSchedueNotes)
          .subscribe(response => {
            this.LoadExistingNotes();
            this._alertService.success("Notes has been deleted successfully");
            this.currentSchedueNotes = new JobBoardResponsesNotes();
            this.fileUploadResponse = new FileAttachmentResponse();
            this.fileUploadLoading = false;
            this.isFileUploaded = false;
            this.IsFileLoading = false;

            this.commentCtrl.setValue(null);

            if (!this.cdRef["distroyed"]) {
              this.cdRef.detectChanges();
            }
          },
            error => {
              this._alertService.error(error);
            });
      }
    });

  }

  setdefault(){
    this.btn_title = "SUBMIT";
    this.isSubmitting = false; 
    this.currentSchedueNotes = new JobBoardResponsesNotes();
    this.fileUploadResponse = new FileAttachmentResponse();
    this.commentCtrl.setValue(null);
    this.cdRef.detectChanges();
  }

  formatText(text: string): string {
    return text ? text.replace(/\n/g, '<br>') : '';
  }


}
