import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Icon } from '@visurel/iconify-angular';
import faCaretUp from '@iconify/icons-fa-solid/caret-up';
import faCaretDown from '@iconify/icons-fa-solid/caret-down';
import icHelp from '@iconify/icons-ic/help-outline';
import icShare from '@iconify/icons-ic/twotone-share';
import icTrendingUp from '@iconify/icons-ic/twotone-trending-up';
import icTrendingDown from '@iconify/icons-ic/twotone-trending-down';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { scaleInOutAnimation } from 'src/@cv/animations/scale-in-out.animation';

@Component({
  selector: 'cv-wc-applicants-count',
  templateUrl: './wc-applicants-count.component.html',
  styleUrls: ['./wc-applicants-count.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [scaleInOutAnimation]
})
export class WcApplicantsCountComponent implements OnInit {

  @Input() icon: Icon;
  @Input() Totalvalue: string;
  @Input() Subvalue1: string;
  @Input() Subvalue2: string;
  @Input() Totallabel: string;
  @Input() Sublabel1: string;
  @Input() Sublabel2: string;
  @Input() change: number;
  @Input() helpText: string;
  @Input() iconClass: string;
  @Input() Is3Columns:boolean = false;
  @Input() Subvalue3:string;
  @Input() Sublabel3:string;

  faCaretUp = faCaretUp;
  faCaretDown = faCaretDown;
  icHelp = icHelp;
  icShare = icShare;
  icTrendingUp=icTrendingUp;
  icTrendingDown=icTrendingDown;
  showButton: boolean;

  constructor(private _bottomSheet: MatBottomSheet) { }

  ngOnInit() {
  }

  openSheet() {
  }

}
