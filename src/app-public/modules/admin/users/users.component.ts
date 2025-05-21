import { ChangeDetectorRef, Component, OnInit } from '@angular/core'
import icContacts from '@iconify/icons-ic/twotone-contacts';
import icSearch from '@iconify/icons-ic/twotone-search';
import icStar from '@iconify/icons-ic/twotone-star';
import { scaleIn400ms } from 'src/@cv/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@cv/animations/fade-in-right.animation';
import { TableColumn } from 'src/@cv/interfaces/table-column.interface';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { MatDialog } from '@angular/material/dialog';
import { UsersEditComponent } from './users-edit/users-edit.component';
import { UsersViewComponent } from './users-view/users-view.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import icMenu from '@iconify/icons-ic/twotone-menu';
import icAdd from '@iconify/icons-ic/twotone-add';
import { LoginUser } from 'src/@shared/models';
import { ConsultviteUser } from '../core/models';
import { AlertService, AuthenticationService, EventEmitterService, TimeZoneService } from 'src/@shared/services';
import { UserService } from '../core/http/user.service';
import icPerson from '@iconify/icons-ic/person';
import icPerson_Pin from '@iconify/icons-ic/person-pin';
import isSupervised_User_Circle  from '@iconify/icons-ic/sharp-supervised-user-circle';

@Component({
  selector: 'cv-users-table',
  templateUrl: './users.component.html',
  animations: [
    stagger40ms,
    scaleIn400ms,
    fadeInRight400ms
  ]
})
export class UsersComponent implements OnInit {

  icAdd = icAdd;
  searchCtrl = new FormControl();

  searchStr$ = this.searchCtrl.valueChanges.pipe(
    debounceTime(10)
  );
  
  activeStatus = "";

  menuOpen = false;

  activeCategory: 'all' | 'internal' | 'consultant' | 'active' | 'inactive';
  tableData:ConsultviteUser[] = [];
  tableColumns: TableColumn<ConsultviteUser>[] = [
   
    {
      label: 'FIRST NAME',
      property: 'FirstName',
      type: 'text',
      cssClasses: ['font-medium']
    },
    {
      label: 'LAST NAME',
      property: 'LastName',
      type: 'text',
      cssClasses: ['font-medium']
    },
    {
      label: 'EMAIL',
      property: 'Email',
      type: 'text',
      cssClasses: ['text-secondary']
    },
    {
      label: 'PHONE',
      property: 'PhoneNo',
      type: 'button',
      cssClasses: ['text-secondary']
    },
    {
      label: 'USER TYPE',
      property: 'UserType',
      type: 'badge',
      cssClasses: ['text-secondary' , 'w-10']
    },
    {
      label: 'STATUS',
      property: 'IsActive',
      type: 'checkbox',
      cssClasses: ['w-6']
    },
    {
      label:'LAST LOGIN',
      property:'LastLoggedIn',
      type:'text',
      cssClasses: ['text-secondary']
    },
    {
      label: '',
      property: 'menu',
      type: 'button',
      cssClasses: ['text-secondary', 'w-10']
    },
  ];

  icStar = icStar;
  icSearch = icSearch;
  icContacts = icContacts;
  icMenu = icMenu;
  icPerson = icPerson;
  icPerson_Pin = icPerson_Pin;
  isSupervised_User_Circle=isSupervised_User_Circle;

  loginUser: LoginUser;
  users: ConsultviteUser[];
  selectedCategory:string = null;
  selectedStatus:string = "Active";

  constructor(private dialog: MatDialog,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private _userService: UserService,
    private cdRef: ChangeDetectorRef,
    private _eventEmitterService:EventEmitterService) { }

  ngOnInit() {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
        this.getCompanyUsers(this.loginUser.Company.Id);
    }
  }

  getCompanyUsers(companyId: number) {
    this._userService.getCompanyUsers(companyId).subscribe(users => {
        if (users && users.length > 0) {
          users.forEach(user => {
                user.CreatedDate = TimeZoneService.getLocalDateTime_Timestamp(user.CreatedDate, true);
                user.LastLoggedIn = user.LastLoggedIn ? TimeZoneService.getLocalDateTime_Timestamp(user.LastLoggedIn, true) : "";
                //user.PhoneNo = this.phoneNumberFormate(user.PhoneNo);
            });
        }
        this.users = users;
        //this.setData('all');
        this.filterCategory('all');
    },
        error => {
            this._alertService.error(error);
        });
  }

  private phoneValid(phoneno) {
    
    if (phoneno.includes("-")) {
        const phone = phoneno.split("-");
        const num = this.phoneNumberFormate(phone[1]);
        phoneno = num != null ? phone[0] + " " + num : "";
    } else {
        let number = phoneno.slice(-10);
        let numbercode = phoneno.substring(0, phoneno.length - 10);
        const num = this.phoneNumberFormate(number);
        phoneno = num != null ? numbercode + " " + num : "";
    }
    return phoneno;
  }
  private phoneNumberFormate(phoneno) {
    //normalize string and remove all unnecessary characters
    if (phoneno) {
        phoneno = phoneno.replace(/[^\d]/g, "");
        //check if number length equals to 10
        if (phoneno.length == 10) {
            //reformat and return phone number
            return phoneno.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
        } else {
            return null;
        }
    } else {
        return null;
    }
  }

  // setData(category: string) {
  //   this.selectedCategory = category;
  //   this.activeStatus = "";
  //   if(category == 'internal'){
  //     this.tableData = this.users.filter(i=>i.UserType > 0);
  //   }
  //   else  if(category == 'consultant'){
  //     this.tableData = this.users.filter(i=>i.UserType == 0);
  //   }
  //   else {
  //      this.tableData = this.users.filter(i=>i.UserType >= 0);
  //   }
  //   this.menuOpen = false;
  // }

  // openMenu() {
  //   this.menuOpen = true;
  // }

  addUser(userType:number) {
    let user = <ConsultviteUser>{};
    user.UserType = userType;
    const dialogRef = this.dialog.open(UsersEditComponent, {
      data: user || null,
      width: '800px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(userObj => {debugger;
      let user = <ConsultviteUser> userObj.data;
     if(user){
      this.users.push(user);
      this.tableData =  this.users;
      this.filterCategory('all');
      //this.setData(this.selectedCategory);
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
     }
    });
  }

  editUser(user?: ConsultviteUser) {
    const dialogRef =  this.dialog.open(UsersEditComponent, {
      data: user || null,
      width: '800px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(userObj => {
      let user = <ConsultviteUser> userObj.data;
      let index = this.users.findIndex(i=>i.UserId==user.UserId)
      this.users.splice(index,1,user);
      this.tableData =  this.users;
      this._eventEmitterService.userUpdateEvent.emit(user);
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    });
  }

  toggleStatus(user: ConsultviteUser) {
    this.updateUserStatus(user.UserId,user.UserType,user.IsActive);
  }

  viewUser(user: ConsultviteUser) {
    this.dialog.open(UsersViewComponent, {
      data: user || null,
      width: '800px',
      disableClose: true
    });
  }

  resetPassword(user: ConsultviteUser) {
    this.dialog.open(ResetPasswordComponent, {
      data: user || null,
      width: '450px',
      disableClose: true
    });
  }

  updateUserStatus(userId: string, userType: number,activeStatus: boolean) {
    if (userType == 0) {
        this._userService.updateConsultantUserStatus(userId, activeStatus)
        .subscribe(consultantUser => {
            this._alertService.success("Consultant user status updated successfully");
        }, error => {
            this._alertService.error(error);
        });
    } else {
        this._userService.updateInternalUserStatus(userId, activeStatus)
        .subscribe(
          internalUser => {
              this._alertService.success("Internal user status updated successfully");
          },
          error => {
              this._alertService.error(error);
          }); 
    }
 } 

 filterStatus(status:boolean) {
   if(status){
    this.selectedStatus = "Active";
   }
   else{
    this.selectedStatus = "Inactive";
   }
    if( this.selectedCategory == 'Internal Users'){
      this.tableData = this.users.filter(i=>i.UserType > 0 && i.IsActive == status);
    }
    else  if( this.selectedCategory == 'Consultant Users'){
      this.tableData = this.users.filter(i=>i.UserType == 0 && i.IsActive == status);
    }
    else {
       this.tableData = this.users.filter(i=> i.IsActive == status); 
    }
  }

  filterCategory(category: string) {debugger;
    if(category == 'internal'){
      if(this.selectedStatus = "Active")
         this.tableData = this.users.filter(i=>i.UserType > 0 && i.IsActive == true);
      else  if(this.selectedStatus = "Inactive")  
          this.tableData = this.users.filter(i=>i.UserType > 0 && i.IsActive == false);
      else 
          this.tableData = this.users.filter(i=>i.UserType > 0 && i.IsActive == true);
          
      this.selectedCategory = "Internal Users";
    }
    else  if(category == 'consultant'){
      if(this.selectedStatus = "Active")
          this.tableData = this.users.filter(i=>i.UserType == 0 && i.IsActive == true);
      else  if(this.selectedStatus = "Inactive")  
          this.tableData = this.users.filter(i=>i.UserType == 0 && i.IsActive == false);
      else
          this.tableData = this.users.filter(i=>i.UserType == 0 && i.IsActive == true);
      this.selectedCategory = "Consultant Users";
    }
    else {
      if(this.selectedStatus = "Active")
        this.tableData = this.users.filter(i=>i.UserType >= 0 && i.IsActive == true);
      else  if(this.selectedStatus = "Inactive")  
        this.tableData = this.users.filter(i=>i.UserType >= 0 && i.IsActive == false);
      else
        this.tableData = this.users.filter(i=>i.UserType >= 0 && i.IsActive == true);
       this.selectedCategory = "All Users";
    }
  }
}
