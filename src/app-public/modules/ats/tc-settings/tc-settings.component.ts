import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Icon } from '@visurel/iconify-angular';
import { fadeInRight400ms } from 'src/@cv/animations/fade-in-right.animation';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import icPerson from '@iconify/icons-ic/person';
import icPerson_Pin from '@iconify/icons-ic/person-pin';
import icaccount_box from '@iconify/icons-ic/account-box';
import icvintage from '@iconify/icons-ic/round-filter-vintage';
import icactivity from '@iconify/icons-ic/local-activity';
import iccontact_calendar from '@iconify/icons-ic/event';
import isSupervisor_Account from '@iconify/icons-ic/supervisor-account'
import icLabel from '@iconify/icons-ic/twotone-label';
import icPersonAdd from '@iconify/icons-ic/twotone-person-add';
import icMenu from '@iconify/icons-ic/twotone-menu';
import { scaleIn400ms } from 'src/@cv/animations/scale-in.animation';
import icSettings from '@iconify/icons-ic/settings';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'cv-tc-settings',
  templateUrl: './tc-settings.component.html',
  styleUrls: ['./tc-settings.component.scss'],
  animations: [
    stagger40ms,
    scaleIn400ms,
    fadeInRight400ms
  ]
})
export class TcSettingsComponent implements OnInit {
  icMenu=icMenu;
  menuOpen = true;
  icSettings=icSettings;
  @Input() index: number = 0;
  activeCategory: string = 'all';
  @Output() filterChange = new EventEmitter<string>();
   items: UsersTableMenu[] = [
    {
      type: 'link',
      id: 'source',
      icon: isSupervisor_Account,
      label: 'Resume Source',
      route:"resume-source",
      routerLinkActiveOptions: { exact: true }
    },
    {
      type: 'link',
      id:'hash',
      icon: icvintage,
      label: 'HashTags',
      route:'hashtags',
      routerLinkActiveOptions: { exact: true }
    },
    {
      type: 'link',
      id: 'consultant',
      icon: icaccount_box,
      label: 'Account Types',
      route:'accounttypes',
      routerLinkActiveOptions: { exact: true }
    },
    {
      type: 'link',
      id: 'interviewstatus',
      icon: iccontact_calendar,
      label: 'Interview Status',
      route:'interview-status',
      routerLinkActiveOptions: { exact: true }
    },
    {
      type: 'link',
      id: 'inactive',
      icon: icactivity,
      label: 'Submission Status',
      route:'submissionsstatus',
      routerLinkActiveOptions: { exact: true }
    },
    {
      type: 'link',
      id: 'internal',
      icon: icPerson_Pin,
      label: 'Keywords',
      route:'keywords',
      routerLinkActiveOptions: { exact: true }
    },
  ];

 

  constructor(private permissionsService: NgxPermissionsService) { }

  ngOnInit(): void {
  }

  openMenu(){

  }

  setFilter(category: string) {
    this.activeCategory = category;
    return this.filterChange.emit(category);
  }

  isActive(serType?: string) {
    return this.activeCategory === serType;
  }

}

export interface UsersTableMenu {
  type: 'link' | 'subheading';
  id?: 'all'| 'internal' | 'consultant' | 'active' | 'inactive'|'interviewstatus'|'source'|'hash' ;
  icon?: Icon;
  label: string;
  classes?: {
    icon?: string;
  };
  route?:string;
  routerLinkActiveOptions?: { exact: boolean };
}
