import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { fadeInUp400ms } from '../../../@cv/animations/fade-in-up.animation';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { stagger40ms } from '../../../@cv/animations/stagger.animation';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import icClose from '@iconify/icons-ic/twotone-close';

@UntilDestroy()
@Component({
  selector: 'cv-terms-and-condtions',
  templateUrl: './terms-and-condtions.component.html',
  styleUrls: ['./terms-and-condtions.component.scss'],
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
export class TermsAndCondtionsComponent implements OnInit ,AfterViewInit {

  icClose = icClose;
  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
  }
}
