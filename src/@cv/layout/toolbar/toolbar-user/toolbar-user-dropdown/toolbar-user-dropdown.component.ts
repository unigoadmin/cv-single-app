import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MenuItem } from '../interfaces/menu-item.interface';
import { trackById } from '../../../../utils/track-by';
import icPerson from '@iconify/icons-ic/twotone-person';
import icSettings from '@iconify/icons-ic/twotone-settings';
import icAccountCircle from '@iconify/icons-ic/twotone-account-circle';
import icMoveToInbox from '@iconify/icons-ic/twotone-move-to-inbox';
import icListAlt from '@iconify/icons-ic/twotone-list-alt';
import icTableChart from '@iconify/icons-ic/twotone-table-chart';
import icCheckCircle from '@iconify/icons-ic/twotone-check-circle';
import icAccessTime from '@iconify/icons-ic/twotone-access-time';
import icDoNotDisturb from '@iconify/icons-ic/twotone-do-not-disturb';
import icOfflineBolt from '@iconify/icons-ic/twotone-offline-bolt';
import icChevronRight from '@iconify/icons-ic/twotone-chevron-right';
import icArrowDropDown from '@iconify/icons-ic/twotone-arrow-drop-down';
import icBusiness from '@iconify/icons-ic/twotone-business';
import icVerifiedUser from '@iconify/icons-ic/twotone-verified-user';
import icLock from '@iconify/icons-ic/twotone-lock';
import icNotificationsOff from '@iconify/icons-ic/twotone-notifications-off';
import { Icon } from '@visurel/iconify-angular';
import { PopoverRef } from '../../../../components/popover/popover-ref';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { LoginUser } from 'src/@shared/models';
import icRefresh from '@iconify/icons-ic/twotone-refresh';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordComponent } from 'src/@shared/components/change-password/change-password.component';
import { InternalUserProfileComponent } from 'src/@shared/components/internal-user-profile/internal-user-profile.component';
import { ConsultantUserProfileComponent } from 'src/@shared/components/consultant-user-profile/consultant-user-profile.component';

export interface OnlineStatus {
  id: 'online' | 'away' | 'dnd' | 'offline';
  label: string;
  icon: Icon;
  colorClass: string;
}

@Component({
  selector: 'vex-toolbar-user-dropdown',
  templateUrl: './toolbar-user-dropdown.component.html',
  styleUrls: ['./toolbar-user-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarUserDropdownComponent implements OnInit {

  items: MenuItem[] = [
    {
      id: '1',
      icon: icAccountCircle,
      label: 'My Profile',
      description: 'Personal Information',
      colorClass: 'text-primary',
      route: '/apps/social'
    },
    {
      id: '2',
      icon: icRefresh,
      label: 'Change Password',
      description: 'Change Password',
      colorClass: 'text-primary',
      route: '/apps/chat'
    },
    
  ];

  statuses: OnlineStatus[] = [
    {
      id: 'online',
      label: 'Online',
      icon: icCheckCircle,
      colorClass: 'text-green'
    },
    {
      id: 'away',
      label: 'Away',
      icon: icAccessTime,
      colorClass: 'text-orange'
    },
    {
      id: 'dnd',
      label: 'Do not disturb',
      icon: icDoNotDisturb,
      colorClass: 'text-red'
    },
    {
      id: 'offline',
      label: 'Offline',
      icon: icOfflineBolt,
      colorClass: 'text-gray'
    }
  ];

  activeStatus: OnlineStatus = this.statuses[0];

  trackById = trackById;
  icPerson = icPerson;
  icSettings = icSettings;
  icChevronRight = icChevronRight;
  icArrowDropDown = icArrowDropDown;
  icBusiness = icBusiness;
  icVerifiedUser = icVerifiedUser;
  icLock = icLock;
  icNotificationsOff = icNotificationsOff;
  icRefresh = icRefresh
   
  userName:string = "";
  loginUser: LoginUser;

  constructor(private cd: ChangeDetectorRef,
              private popoverRef: PopoverRef<ToolbarUserDropdownComponent>,
              private authService:AuthenticationService,
              private dialog: MatDialog,
              private _alertService: AlertService) { }

  ngOnInit() {
    this.userName = this.authService.getUserName();
    this.loginUser = this.authService.getLoginUser();
  }

  open(item:MenuItem){
    if(item.id == '1'){
      if(this.loginUser.Role == "employer" || this.loginUser.Role == "admin"){
        this.dialog.open(InternalUserProfileComponent, {
          data: null,
          width: '1200px',
          disableClose: true
        });
      }else if(this.loginUser.Role == "candidate" ){
        this.dialog.open(ConsultantUserProfileComponent, {
          data: null,
          width: '1200px',
          disableClose: true
        });
      }
    }else if(item.id == '2'){
      this.dialog.open(ChangePasswordComponent, {
        data: null,
        width: '450px',
        disableClose: true
      });
    }
    this.popoverRef.close();
  }

  setStatus(status: OnlineStatus) {
    this.activeStatus = status;
    this.cd.markForCheck();
  }

  close() {
    this.popoverRef.close();
    this.authService.logout();
  }
}
