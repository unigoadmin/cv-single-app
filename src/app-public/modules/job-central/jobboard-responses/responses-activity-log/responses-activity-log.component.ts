import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from 'src/@cv/animations/scale-fade-in.animation';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { ActivityLogCandidate } from 'src/@shared/models/candidateActivityLog';

@Component({
  selector: 'cv-responses-activity-log',
  templateUrl: './responses-activity-log.component.html',
  styleUrls: ['./responses-activity-log.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms,
    scaleFadeIn400ms
  ],
})
export class ResponsesActivityLogComponent implements OnInit {

  @Input() activityLogs: ActivityLogCandidate[];
  /** Whether the sidenav is open or closed */
  @Input() isSidenavOpen: boolean = false;

  /** Event emitted when the sidenav close button is clicked */
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  constructor() { }

  ngOnInit(): void {
  }

  onClose(): void {
    this.close.emit();
  }

}
