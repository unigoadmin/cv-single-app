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
import { ConsultviteUser, RoleUsers, ModuleRolePermissions, Roles } from '../../core/models';
import { LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { RoleService } from '../../core/http/role.service';
import { forkJoin, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { scaleIn400ms } from 'src/@cv/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@cv/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';


@Component({
  selector: 'cv-roles-users',
  templateUrl: './roles-users.component.html',
  styleUrls: ['./roles-users.component.scss'],
  animations: [
    stagger40ms,
    scaleIn400ms,
    fadeInRight400ms,
    fadeInUp400ms
  ],

})
export class RolesUsersComponent implements OnInit {

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
  users:ConsultviteUser[] = [];
  selectedUser:ConsultviteUser=null;

  myControl = new FormControl();
  filteredOptions: Observable<ConsultviteUser[]>;

  constructor(@Inject(MAT_DIALOG_DATA,)public role: Roles,
              private dialogRef: MatDialogRef<RolesUsersComponent>,
              private fb: FormBuilder,
              private _alertService: AlertService,
              private _authService: AuthenticationService,
              private _roleService:RoleService) {

  
}

  ngOnInit() {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.getUsers();
    }
  }

  displayFn(user: ConsultviteUser): string {
    return user && user.FullName ? user.FullName : '';
  }

  private _filter(value: string): ConsultviteUser[] {
    const filterValue = value.toLowerCase();
    return this.users.filter(option => option.FullName.toLowerCase().indexOf(filterValue) === 0);
  }

  filterUsers(){
    this.users.sort((a, b) => {
      var valueA = a.FullName, valueB = b.FullName
      if (valueA < valueB)
        return -1
      if (valueA > valueB)
        return 1
      return 0
    });
    this.filteredOptions = this.myControl.valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this._filter(name) : this.users.slice())
    );
  }

  addUser(){
    if(this.selectedUser!=null){
      if(this.selectedUser?.UserId){
        let user:ConsultviteUser = Object.assign({},this.selectedUser);
        this.role.Users.push(user);
        this.users =  this.users.filter(i=> i.UserId != this.selectedUser.UserId);
        this.filterUsers();
      }
      else{
        this._alertService.error("User is not available");
      }
    }
    
    this.selectedUser = null;
  }
  removeUser(user:ConsultviteUser){
    if(user.UserType != 1 && user.UserType != 2){
      const index = this.role.Users.indexOf(user);
      if (index >= 0) {
        this.role.Users.splice(index, 1);

        this.users.push(user);
        this.filterUsers();
      }
    }
  }

  getUsers(){
    forkJoin([
      this._roleService.getRoleUnAssignedUsers(this.role.ModuleId,this.loginUser.Company.Id,this.role.UserType),
      this._roleService.getRoleUsers(this.role.RoleId,this.role.ModuleId,this.loginUser.Company.Id,this.role.UserType)])
      .subscribe(result => {

        this.users = result[0];
        this.role.Users = result[1];

        this.users = this.users.filter(i=> !this.role.Users.some(j=>j.UserId == i.UserId));
        this.filterUsers();
      },
    error => {
        this._alertService.error(error);
    });
  }
  
  saveUsers() {

    let roleUsers:RoleUsers  = <RoleUsers>{};
    roleUsers.CompanyId = this.loginUser.Company.Id;
    roleUsers.ModuleId = this.role.ModuleId;
    roleUsers.RoleId = this.role.RoleId;
    roleUsers.UserType = this.role.UserType;
    roleUsers.UpdatorId = this.loginUser.UserId;
    roleUsers.Users = [];
    this.role.Users.forEach(user=>{
        roleUsers.Users.push(user.UserId);
    });
   
    
    this._roleService.saveRoleUsers(roleUsers)
    .subscribe(users => {
      this.dialogRef.close({data:users});
      this._alertService.success("Role users updated successfully");
    }, error => {
      this._alertService.error(error);
    });
   
    
  }
}
