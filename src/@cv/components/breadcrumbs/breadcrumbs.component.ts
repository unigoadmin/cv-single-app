import { Component, Input, OnInit } from '@angular/core';
import icHome from '@iconify/icons-ic/twotone-home';
import { trackByValue } from '../../utils/track-by';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'vex-breadcrumbs',
  template: `
    <div class="flex items-center">
      <vex-breadcrumb>
        <a  href="{{url}}">
          <ic-icon [icon]="icHome" inline="true" size="20px"></ic-icon>
        </a>
      </vex-breadcrumb>
      <ng-container *ngFor="let crumb of crumbs; trackBy: trackByValue">
        <div class="w-1 h-1 bg-gray rounded-full ltr:mr-2 rtl:ml-2"></div>
        <vex-breadcrumb>
          <a [routerLink]="[]">{{ crumb }}</a>
        </vex-breadcrumb>
      </ng-container>
    </div>
  `
})
export class BreadcrumbsComponent implements OnInit {

  @Input() crumbs: string[] = [];
  @Input('matIcon') Icon:any;

  trackByValue = trackByValue;
  icHome = icHome;
  url=environment.cvHomePage;

  constructor() {
  }

  ngOnInit() {
  }
}
