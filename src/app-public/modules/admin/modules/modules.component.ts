import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatDialog } from '@angular/material/dialog';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icCloud_Upload from '@iconify/icons-ic/cloud-upload';
import icRemove_Circle_Outline from '@iconify/icons-ic/remove-circle-outline';
import { LoginUser } from 'src/@shared/models';
import { ModuleService } from '../core/http/module.service';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { CompanyModules } from '../core/models';
import { ModulesEditComponent } from './modules-edit/modules-edit.component';
import icView_Module from '@iconify/icons-ic/view-module';




@UntilDestroy()
@Component({
  selector: 'cv-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.scss'],
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
export class ModulesComponent implements OnInit ,AfterViewInit {

  icEdit = icEdit;
  icCloud_Upload = icCloud_Upload;
  icRemove_Circle_Outline = icRemove_Circle_Outline;
  icView_Module=icView_Module;
  companyId: number;
  loginUser: LoginUser;
  companyModules: CompanyModules[]=[];
  constructor(private dialog: MatDialog,
    private _moduleService:ModuleService,
    private _alertService: AlertService,
    private _authService: AuthenticationService) { }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
        this.companyId = this.loginUser.Company.Id;
        this.getCompanyModules(this.companyId);
    }
  }
  
  ngAfterViewInit() {
  }

  openModules(){
    const dialogRef =  this.dialog.open(ModulesEditComponent, {
      data: this.companyModules || null,
      width: '700px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(companyModules => {
      this.companyModules = companyModules;
    });
  }

  getCompanyModules(companyId:number) {

      this._moduleService.getCompanyModules(companyId)
        .subscribe(
        (companyModules) => {
          this.companyModules = companyModules.filter(module => module.IsEnabled);
        },
        error => {
            this._alertService.error(error);
        });
   }
}
