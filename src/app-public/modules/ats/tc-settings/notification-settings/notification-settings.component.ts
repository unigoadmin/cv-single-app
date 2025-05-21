import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { LoginUser } from 'src/@shared/models';
import { IconService } from 'src/@shared/services/icon.service';
import { iconsFA } from 'src/static-data/icons-fa';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { TalentCentralSettings, TalentCentralNotifications } from '../../core/models/talent-central-notifications';
import { GlobalSettingsService } from 'src/@shared/http/globalsettings.service';

@Component({
  selector: 'cv-notification-settings',
  templateUrl: './notification-settings.component.html',
  styleUrls: ['./notification-settings.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
})
export class NotificationSettingsComponent implements OnInit {
  
  settingsForm: FormGroup;
  loginUser: LoginUser;
  filteredIcons: string;
  notficationsItems:[];
  tcSettings:TalentCentralSettings;
  
  searchCtrl = new FormControl();
  constructor(
    private fb: FormBuilder,
    private _authService: AuthenticationService,
    public iconService: IconService,
    private service: GlobalSettingsService,
    private cdRef: ChangeDetectorRef,
    private _alertService: AlertService,
  ) { }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.GetNotifications();
      this.filteredIcons = iconsFA.find(iconName => iconName == "fa-filter");
    }
    this.settingsForm = this.fb.group({
      companyId: ['', Validators.required],
      createdBy: ['', Validators.required],
      notficationsItems: this.fb.array([])
    });
  }

  createNotificationGroup(): FormGroup {
    return this.fb.group({
      notificationType: ['', Validators.required],
      notificationLabel: ['', Validators.required],
      sendNotification: [false],
    });
  }

  get notificationsItems(): FormArray {
    return this.settingsForm.get('notficationsItems') as FormArray;
  }


  saveSettings(): void{
   
    const formValue = this.settingsForm.value;
    const talentCentralSettings = {
      TcSettings_id: this.tcSettings.TcSettings_id,
      CompanyId: formValue.companyId,
      NotificationSettings: JSON.stringify(formValue.notficationsItems), 
      CreatedBy: formValue.createdBy,
      CreatedDate: new Date(), 
      UpdatedBy: this.loginUser.UserId, 
      UpdatedDate: null,
      NotficationsItems: formValue.notficationsItems
    };

    this.service.SaveTCSetting(talentCentralSettings).subscribe(response => {
      if (!response.IsError) {
        this._alertService.success(response.SuccessMessage);
      } else {
        // Handle error
        this._alertService.error(response.ErrorMessage);
      }
    });

  }

  GetNotifications() {
    this.service.GetNotificationsList(this.loginUser.Company.Id).subscribe(response => {
      if (!response.IsError) {
        this.tcSettings = response.Data;
        this.populateForm();
      }
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    });
  }

  populateForm(): void {
    this.settingsForm.patchValue({
      companyId: this.tcSettings.CompanyId,
      createdBy: this.tcSettings.CreatedBy
    });

    const notificationsArray = this.settingsForm.get('notficationsItems') as FormArray;
    this.tcSettings.NotficationsItems.forEach(notification => {
      notificationsArray.push(this.fb.group({
        notificationType: [notification.NotificationType, Validators.required],
        notificationLabel: [notification.NotificationLabel, Validators.required],
        sendNotification: [notification.SendNotification]
      }));
    });
  }

}
