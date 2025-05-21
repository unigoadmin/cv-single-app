import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import icStar from '@iconify/icons-ic/twotone-star';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import icClose from '@iconify/icons-ic/twotone-close';
import icPrint from '@iconify/icons-ic/twotone-print';
import icDownload from '@iconify/icons-ic/twotone-cloud-download';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icBusiness from '@iconify/icons-ic/twotone-business';
import icPhone from '@iconify/icons-ic/twotone-phone';
import icEmail from '@iconify/icons-ic/twotone-mail';
import icPerson from '@iconify/icons-ic/twotone-person';
import icStarBorder from '@iconify/icons-ic/twotone-star-border';
import icChevron_Right from '@iconify/icons-ic/twotone-chevron-right';
import icExpand_More from '@iconify/icons-ic/twotone-expand-more';
import icPerson_Add from '@iconify/icons-ic/twotone-person-add';
import icRemove_Circle_Outline from '@iconify/icons-ic/twotone-remove-circle-outline';
import { FormBuilder, FormControl } from '@angular/forms';

import { LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService } from 'src/@shared/services';

import { forkJoin, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DocumentService } from '../../core/http/document.service';
import { DocvaultUserDocuments, SharedUsers, SharingDocuments } from '../../core/models';



@Component({
  selector: 'cv-documents-sharing',
  templateUrl: './documents-sharing.component.html',
  styleUrls: ['./documents-sharing.component.scss'],

})
export class DocumentsSharingComponent implements OnInit {

  icStar = icStar;
  icStarBorder = icStarBorder;
  icMoreVert = icMoreVert;
  icClose = icClose;

  icPrint = icPrint;
  icDownload = icDownload;
  icDelete = icDelete;

  icBusiness = icBusiness;
  icPerson = icPerson;
  icEmail = icEmail;
  icPhone = icPhone;
  icChevron_Right = icChevron_Right;
  icExpand_More = icExpand_More;
  icPerson_Add = icPerson_Add;
  icRemove_Circle_Outline = icRemove_Circle_Outline;

  loginUser: LoginUser;
  users: SharedUsers[] = [];
  sharedUsers: SharedUsers[] = [];
  selectedUser: SharedUsers = null;
  CurrentSharing: SharingDocuments;


  myControl = new FormControl();
  filteredOptions: Observable<SharedUsers[]>;
  UserRole: string;

  constructor(@Inject(MAT_DIALOG_DATA,) private document: DocvaultUserDocuments,
    private dialogRef: MatDialogRef<DocumentsSharingComponent>,
    private fb: FormBuilder,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private _documentService: DocumentService) {
    this.CurrentSharing = new SharingDocuments();

    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.users.slice())
      );

  }

  ngOnInit() {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      debugger;
      if (this.loginUser.Role == 'employer') {
        debugger;
        this.UserRole = 'employer';
        this.getTeamMembersData();
      }
      else {
        this.UserRole = 'candidate';
        this.getTeamMembersForConsultant();
      }

    }
  }

  displayFn(user: SharedUsers): string {
    return user && user.UserName ? user.UserName : '';
  }

  private _filter(value: string): SharedUsers[] {
    const filterValue = value.toLowerCase();
    return this.users.filter(option => option.UserName.toLowerCase().indexOf(filterValue) === 0);
  }

  filterUsers() {
    this.users.sort((a, b) => {
      var valueA = a.UserName, valueB = b.UserName
      if (valueA < valueB)
        return -1
      if (valueA > valueB)
        return 1
      return 0
    });

  }

  addUser() {
    if (this.selectedUser) {
      let user: SharedUsers = Object.assign({}, this.selectedUser);
      this.sharedUsers.push(user);
      this.users = this.users.filter(i => i.UserId != this.selectedUser.UserId);
      this.filterUsers();

    }
    this.selectedUser = null;
  }
  removeUser(user: SharedUsers) {

    const index = this.sharedUsers.indexOf(user);
    if (index >= 0) {
      this.sharedUsers.splice(index, 1);

      this.users.push(user);
      this.filterUsers();
    }

  }

  getTeamMembersData() {
    this._documentService.GetTeamMembers(this.loginUser.Company.Id, this.loginUser.UserId)
      .subscribe(response => {
        this.users = response;
        this.users = this.users.filter(i => i.UserId != this.loginUser.UserId);
        this.filterUsers();
      }, error => {
        this._alertService.error(error);
      });
  }

  getTeamMembersForConsultant() {
    this._documentService.GetTeamMembersForConultants(this.loginUser.Company.Id, this.loginUser.UserId)
      .subscribe(response => {
        this.users = response;
        this.users = this.users.filter(i => i.UserId != this.loginUser.UserId);
        this.filterUsers();
      }, error => {
        this._alertService.error(error);
      });
  }

  onSelectedChange(event: any) {
    this.sharedUsers = [];
    if (event.value == "0") {
      this.users.forEach(user => {
        this.sharedUsers.push(Object.assign({}, user));
      });
    }
    else if (event.value == "1") {
      this.users.forEach(user => {
        if (user.UserType == 3)
          this.sharedUsers.push(Object.assign({}, user));
      });
    }
    else if (event.value == "2") {
      this.users.forEach(user => {
        if (user.UserType == 2)
          this.sharedUsers.push(Object.assign({}, user));
      });
    }
  }

  shareDocument() {
    if (this.CurrentSharing.ShareType == undefined) {
      this._alertService.error('Please Select Share Option');
      return;
    }
    this.CurrentSharing.DocumentId = this.document.DocumentId;
    this.CurrentSharing.SharedBy = this.loginUser.UserId;
    this.CurrentSharing.CompanyId = this.loginUser.Company.Id;
    if (this.loginUser.Role == 'employer') {
      this.CurrentSharing.SharedUserType = 3;
    }
    else if (this.loginUser.Role == 'candidate') {
      this.CurrentSharing.SharedUserType = 2;
    }

    this.CurrentSharing.Status = true;
    //if (this.CurrentSharing.ShareType == 3) 
    //{
    if (!this.sharedUsers || this.sharedUsers.length == 0) {
      this._alertService.error('Please select a recipient');
      return;
    }
    this.CurrentSharing.Recepients = this.sharedUsers.map(i => i.UserName);
    this.CurrentSharing.SharedTo = this.sharedUsers;
    //}
    // else {
    //   this.CurrentSharing.SharedTo = null;
    // }
    this._documentService.ShareDocuments(this.CurrentSharing)
      .subscribe(
        response => {
          if (response && response.length > 0) {
            let sharedUsers = response.join(',');
            this._alertService.error("Documents is already shared to " + sharedUsers);
          }
          if (response && response.length === 0)
            this._alertService.success("Documents shared sucessfully");

          this.dialogRef.close();
        },
        error => {
          this._alertService.error(error);
        });
  }
}
