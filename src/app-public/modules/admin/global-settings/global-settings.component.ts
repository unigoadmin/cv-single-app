import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { LoginUser } from 'src/@shared/models';
import { AuthenticationService } from 'src/@shared/services';
import { GlobalSettingsCategory } from 'src/static-data/global-settings-category';
import { isNullOrUndefined } from 'src/@shared/services/helpers';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { AccountTypes } from 'src/static-data/accounttypes';

@Component({
  selector: 'cv-global-settings',
  templateUrl: './global-settings.component.html',
  styleUrls: ['./global-settings.component.scss'],
  providers: [AccountTypes,GlobalSettingsCategory],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
})
export class GlobalSettingsComponent implements OnInit {
  mobileQuery: MediaQueryList;
  loginUser: LoginUser;
  index: number = 0;
  Default: string = "true";
  isPrefix:boolean=false;
  isResumeSource:boolean=false;
  isCustomMessage:boolean=false;
  isHashTags:boolean=false;
  isKeywords:boolean=false;
  isCandidateStatus:boolean=false;
  isSessionSettings:boolean=false;
  isWorkPermitSettings:boolean=false;
  constructor(
    private _authService: AuthenticationService,
    private cdRef: ChangeDetectorRef,
  ) {
    this.Default = localStorage.getItem("Default");
    if (!isNullOrUndefined(this.Default) && this.Default != '') {
      if (this.Default === "true"){
        this.index = 0;
        this.isPrefix=true;
      }
      else
        this.index = 1;
    }
  }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.isPrefix = true;

      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    }
  }

  onTabChanged(event: MatTabChangeEvent) {debugger;
    if (event.index === 0) {
      this.isPrefix = true;
      this.isHashTags=false;
      this.isKeywords=false;
      this.isResumeSource = false;
      this.isCustomMessage = false;
      this.isCandidateStatus=false;
      this.isSessionSettings = false;
      this.isWorkPermitSettings=false;
    } 
    else if (event.index === 1) {
      this.isPrefix = false;
      this.isHashTags=false;
      this.isKeywords=false;
      this.isCustomMessage = false;
      this.isResumeSource = true;
      this.isCandidateStatus=false;
      this.isSessionSettings = false;
      this.isWorkPermitSettings=false;
    }
    else if(event.index === 2){
      this.isPrefix = false;
      this.isHashTags=false;
      this.isKeywords=true;
      this.isResumeSource = false;
      this.isCustomMessage = false;
      this.isCandidateStatus=false;
      this.isSessionSettings = false;
      this.isWorkPermitSettings=false;
    }
    else if(event.index === 3){
      this.isPrefix = false;
      this.isHashTags=true;
      this.isKeywords=false;
      this.isResumeSource = false;
      this.isCustomMessage = false;
      this.isCandidateStatus=false;
      this.isSessionSettings = false;
      this.isWorkPermitSettings=false;
    }
    else if(event.index === 4){
      this.isPrefix = false;
      this.isHashTags=false;
      this.isKeywords=false;
      this.isResumeSource = false;
      this.isCustomMessage = false;
      this.isCandidateStatus=true;
      this.isSessionSettings = false;
      this.isWorkPermitSettings=false;
    }
    else if(event.index === 5){
      this.isPrefix = false;
      this.isHashTags=false;
      this.isKeywords=false;
      this.isResumeSource = false;
      this.isCandidateStatus=false;
      this.isCustomMessage = true;
      this.isSessionSettings = false;
      this.isWorkPermitSettings=false;
    }
    else if(event.index === 6){
      this.isPrefix = false;
      this.isHashTags=false;
      this.isKeywords=false;
      this.isResumeSource = false;
      this.isCandidateStatus=false;
      this.isCustomMessage = false;
      this.isSessionSettings = true;
      this.isWorkPermitSettings=false;
    }
    else if(event.index === 7){
      this.isPrefix = false;
      this.isHashTags=false;
      this.isKeywords=false;
      this.isResumeSource = false;
      this.isCandidateStatus=false;
      this.isCustomMessage = false;
      this.isSessionSettings = false;
      this.isWorkPermitSettings=true;
    }
    
    
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }

}

