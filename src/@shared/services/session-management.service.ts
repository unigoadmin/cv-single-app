import { Injectable } from '@angular/core';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SessionAlertComponent } from 'src/@shared/components/filter-components/session-alert/session-alert.component';
import { SessionAlertService } from './session-alert.service';


import { AuthenticationService } from './authentication.service';

import { CompanySettingsService } from './company-settings.service';
import { CompanySessionSettings } from '../models/company-settings.model';

@Injectable({
  providedIn: 'root'
})
export class SessionManagementService {
  private lastPing?: Date;
  private idleState = 'Not started.';
  private timedOut = false;
  private dialogRef: MatDialogRef<SessionAlertComponent> | null = null;

  private idleTimeout: number = 3600; // Default 1 hour
  private sessionTimeout: number = 60; // Default 60 seconds
  private keepAliveInterval: number = 15; // Default 15 seconds
  private sessionSettings: CompanySessionSettings = {};

  constructor(
    private idle: Idle,
    private keepalive: Keepalive,
    private dialog: MatDialog,
    private sessionAlertService: SessionAlertService,
    private authService: AuthenticationService,
    private companySettingsService: CompanySettingsService
  ) {}

  initializeSession(companyId: number): Promise<void> {
    return this.getCompanySettings(companyId).then(() => {
      this.initializeIdleSession();
    });
  }

  private initializeIdleSession(): void {
    console.log("loading initializeIdleSession");
    this.idle.setIdle(this.idleTimeout);
    this.idle.setTimeout(this.sessionTimeout);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onIdleEnd.subscribe(() => this.handleIdleEnd());
    this.idle.onTimeout.subscribe(() => this.handleTimeout());
    this.idle.onIdleStart.subscribe(() => this.handleIdleStart());
    this.idle.onTimeoutWarning.subscribe((countdown) => this.handleTimeoutWarning(countdown));

    this.keepalive.interval(this.keepAliveInterval);
    this.keepalive.onPing.subscribe(() => this.lastPing = new Date());

    this.reset();
  }

  private handleIdleEnd() {
    console.log('No longer idle.');
    this.idleState = 'No longer idle.';
    this.reset();
    this.sessionAlertService.hideSessionAlert();
    this.dialogRef?.close();
  }

  private handleTimeout() {
    this.idleState = 'Timed out!';
    this.timedOut = true;
    this.sessionAlertService.hideSessionAlert();
    this.authService.logout();
    console.log('Your session has expired due to inactivity.')
  }

  private handleIdleStart() {
    this.sessionAlertService.showSessionAlert();
    this.dialogRef = this.dialog.open(SessionAlertComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      panelClass: 'custom-modal'
    });

    this.dialogRef.afterClosed().subscribe(async (result) => {
      this.sessionAlertService.hideSessionAlert();
      if (result === true) {
        try {
          this.reset();
          this.sessionAlertService.hideSessionAlert();
        } catch (error) {
          console.error('Error refreshing session:', error);
          this.authService.logout();
        }
      } else {
        this.authService.logout();
      }
    });
  }

  private handleTimeoutWarning(countdown: number) {
    this.idleState = `You will time out in ${countdown} seconds!`;
  }

  private reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  private getCompanySettings(companyId: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {debugger;
      this.companySettingsService.getSessionSettingValues(companyId).subscribe(
        (response) => {debugger;
          this.sessionSettings = response.Data;
          this.idleTimeout = this.sessionSettings.IdleTimeout || 3600;
          this.sessionTimeout = this.sessionSettings.SessionTimeout || 60;
          this.keepAliveInterval = this.sessionSettings.KeepAliveInterval || 15;
          resolve();
        },
        (error) => {
          console.error("Error fetching company settings:", error);
          this.idleTimeout = 3600;
          this.sessionTimeout = 60;
          this.keepAliveInterval = 15;
          reject(error);
        }
      );
    });

  }
}