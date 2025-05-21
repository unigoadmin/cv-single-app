import { Component, OnInit } from '@angular/core';
import icSettings from '@iconify/icons-ic/settings';

@Component({
  selector: 'cv-ts-settings',
  templateUrl: './ts-settings.component.html',
  styleUrls: ['./ts-settings.component.scss']
})
export class TsSettingsComponent implements OnInit {
  icSettings=icSettings;
  constructor() { }

  ngOnInit(): void {
  }

}
