import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import icViewHeadline from '@iconify/icons-ic/twotone-view-headline';
import { Icon } from '@visurel/iconify-angular';
import { fadeInRight400ms } from 'src/@cv/animations/fade-in-right.animation';
import icPersonAdd from '@iconify/icons-ic/twotone-person-add';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import icPerson from '@iconify/icons-ic/person';
import icPerson_Pin from '@iconify/icons-ic/person-pin';
import isSupervisor_Account from '@iconify/icons-ic/supervisor-account'
import icLabel from '@iconify/icons-ic/twotone-label';


export interface UsersTableMenu {
  type: 'link' | 'subheading';
  id?: 'all'| 'internal' | 'consultant' | 'active' | 'inactive' ;
  icon?: Icon;
  label: string;
  classes?: {
    icon?: string;
  };
}

@Component({
  selector: 'cv-users-table-menu',
  templateUrl: './users-table-menu.component.html',
  animations: [fadeInRight400ms, stagger40ms]
})
export class UsersTableMenuComponent implements OnInit {

  @Input() items: UsersTableMenu[] = [
    {
      type: 'link',
      id: 'all',
      icon: isSupervisor_Account,
      label: 'All Users'
    },
    {
      type: 'link',
      id:'internal',
      icon: icPerson,
      label: 'Internal Users'
    },
    {
      type: 'link',
      id: 'consultant',
      icon: icPerson_Pin,
      label: 'Consultant Users'
    },
    // {
    //   type: 'subheading',
    //   label: 'Status'
    // },
    // {
    //   type: 'link',
    //   id: 'active',
    //   icon: icLabel,
    //   label: 'Active',
    //   classes: {
    //     icon: 'text-green'
    //   }
    // },
    // {
    //   type: 'link',
    //   id: 'inactive',
    //   icon: icLabel,
    //   label: 'Inactive',
    //   classes: {
    //     icon: 'text-gray'
    //   }
    // },
  ];

  @Output() filterChange = new EventEmitter<string>();
  @Output() openAddNew = new EventEmitter<void>();

  activeCategory: string = 'all';
  icPersonAdd = icPersonAdd;
  icLabel = icLabel;
  constructor() { }

  ngOnInit() {
    
  }
  setFilter(category: string) {
    this.activeCategory = category;
    return this.filterChange.emit(category);
  }
 

  isActive(serType?: string) {
    return this.activeCategory === serType;
  }
}
