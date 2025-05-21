import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../../services/authentication.service';
import { SessionAlertService } from '../../../services/session-alert.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import icClose from '@iconify/icons-ic/twotone-close';

@Component({
  selector: 'cv-session-alert',
  template: `
<div *ngIf="showAlert" style="width: 500px; padding: 2px; box-sizing: border-box;">
  <!-- Header -->
  <div fxLayout="row" fxLayoutAlign="start center" 
       class="bg-app-bar border-b sticky left-0" 
       style="padding: 16px; height: 64px; background-color: #f5f5f5;">
    
    <div>
      <h2 class="title my-0 leading-snug text-secondary textcgs" style="margin: 0;">
        Session Timeout Warning
      </h2>
    </div>

    <div fxFlex="auto"></div>

    <button class="text-secondary" mat-dialog-close mat-icon-button type="button">
      <mat-icon [icIcon]="icClose"></mat-icon>
    </button>
  </div>

  <!-- Divider -->
  <mat-divider class="-mx-6 text-border"></mat-divider>

  <!-- Content -->
  <mat-dialog-content fxLayout="column" style="padding: 16px 16px 0 16px;">
    <div fxLayout="column" fxLayout.lt-md="column" fxLayoutGap="20px">
      <p>
        Your session will expire automatically in <strong>{{ timer }} seconds</strong>.
        <br>
        Select "Continue session" to extend your session.
      </p>
    </div>
  </mat-dialog-content>

  <!-- Actions/Footer -->
  <mat-dialog-actions align="end" style="padding: 16px;">
    <button class="btn btn-primary" style="margin-right: 12px;" (click)="continueSession()">
      Continue Session
    </button>
    <button class="btn btn-secondary" (click)="logout()">
      End Session
    </button>
  </mat-dialog-actions>
</div>
  `,
  styleUrls: ['./session-alert.component.scss']
})
export class SessionAlertComponent implements OnInit, OnDestroy {
  showAlert = false;
  icClose = icClose;
  timer: number = 60; // Starting countdown time in seconds

  private countdownTimeout: any;
  private subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthenticationService,
    private sessionAlertService: SessionAlertService,
    private dialogRef: MatDialogRef<SessionAlertComponent>,
    private idle: Idle // Injecting Idle service
  ) {}

  ngOnInit(): void {
    // Subscribe to alert service
    const alertSubscription = this.sessionAlertService.showAlert$.subscribe(
      show => {
        this.showAlert = show;

        if (show) {
          this.startCountdown();  // Start countdown when dialog is shown
          this.pauseIdle();        // Prevent idle reset when mouse moves over the dialog
        } else {
          this.clearCountdown();
          this.resumeIdle();       // Resume idle tracking when dialog is closed
        }
      },
      error => {
        console.error('Error in session alert subscription:', error);
        this.showAlert = false;
      }
    );

    this.subscriptions.push(alertSubscription);
  }

  async continueSession(): Promise<void> {
    this.resumeIdle(); // Resume idle tracking when user explicitly continues
    this.dialogRef.close(true);
  }

  async logout(): Promise<void> {
    this.clearCountdown();  // Stop countdown when ending session
    this.dialogRef.close(false);
  }

  ngOnDestroy(): void {
    this.clearCountdown();

    this.subscriptions.forEach(subscription => {
      if (subscription && !subscription.closed) {
        subscription.unsubscribe();
      }
    });

    this.subscriptions = [];
  }

  /** Start countdown for session timeout */
  startCountdown(): void {
    this.clearCountdown();

    this.timer = 60; // Reset timer to 60 seconds

    const endTime = Date.now() + this.timer * 1000;

    const tick = () => {
      const remaining = Math.max(Math.round((endTime - Date.now()) / 1000), 0);
      this.timer = remaining;

      if (remaining > 0) {
        this.countdownTimeout = setTimeout(tick, 250);
      } else {
        this.clearCountdown();
        // Optionally auto-logout when timer reaches zero
        this.logout();
      }
    };

    tick();
  }

  /** Clear the countdown timer */
  clearCountdown(): void {
    if (this.countdownTimeout) {
      clearTimeout(this.countdownTimeout);
      this.countdownTimeout = null;
    }
  }

  /** Pause idle tracking while dialog is open */
  pauseIdle(): void {
    this.idle.clearInterrupts(); // Stop listening to user activity
  }

  /** Resume idle tracking when dialog is closed */
  resumeIdle(): void {
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES); // Re-enable activity tracking
  }
}
