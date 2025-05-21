import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';  
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import isSupervised_User_Circle  from '@iconify/icons-ic/sharp-supervised-user-circle'
import icVerifiedUser  from '@iconify/icons-ic/verified-user'
import icBusiness  from '@iconify/icons-ic/business'
import icPerm_Data_Setting  from '@iconify/icons-ic/perm-data-setting'
import icPayment  from '@iconify/icons-ic/payment'
import icSettings_Applications  from '@iconify/icons-ic/settings-applications'
import icAnnouncement  from '@iconify/icons-ic/announcement'
import icView_Module from '@iconify/icons-ic/view-module'
import icLayers from '@iconify/icons-ic/twotone-layers';
import { MatDialog } from '@angular/material/dialog';
import { DeleteTimesheetsComponent } from '../delete-timesheets/delete-timesheets.component';

@UntilDestroy()
@Component({
  selector: 'cv-wc-admin-console',
  templateUrl: './wc-admin-console.component.html',
  styleUrls: ['./wc-admin-console.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'standard'
      } as MatFormFieldDefaultOptions
    }
  ]
})
export class WcAdminConsoleComponent implements OnInit {

  icBusiness = icBusiness;
  icLayers=icLayers;
  companyPanelOpenState = false;
  constructor( private dialog: MatDialog,) { }

  ngOnInit(): void {
    
  }

  OnDeleteTimesheets(){
    this.dialog.open(DeleteTimesheetsComponent, { panelClass: "dialog-class" ,width:'85vw'}).afterClosed().subscribe((res) => {
      if (res) {
        
      }
    });
  }

}
