import { Component, OnInit } from '@angular/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { AuthenticationService } from 'src/@shared/services';
import { isNullOrUndefined } from 'src/@shared/services/helpers';
import { IconService } from 'src/@shared/services/icon.service';

@Component({
  selector: 'cv-jc-reports',
  templateUrl: './jc-reports.component.html',
  styleUrls: ['./jc-reports.component.scss']
})
export class JcReportsComponent implements OnInit {

  Default: string = "true";
  index: number = 0
  constructor(
    private _authService: AuthenticationService,
    private permissionsService: NgxPermissionsService,
    public iconService : IconService
  ) {
    this.Default = localStorage.getItem("Default");
    if (!isNullOrUndefined(this.Default) && this.Default != '') {
      if (this.Default === "true")
        this.index = 0;
      else
        this.index = 1;
    }

  }

  ngOnInit(): void {
  }

}
