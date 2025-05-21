import { EventEmitter, Injectable } from '@angular/core';


@Injectable({providedIn:'root'})
export class EventEmitterService{

    constructor() {
    }

    public submissionUpdateEvent:EventEmitter<any>=new EventEmitter();
    public intervirewupdateEvent:EventEmitter<any>=new EventEmitter();
    public userUpdateEvent:EventEmitter<any>=new EventEmitter();
    public roleUpdateEvent:EventEmitter<any>=new EventEmitter();
    public linkedinResponseEvent:EventEmitter<any>=new EventEmitter();
    public DiceResponseEvent:EventEmitter<any>=new EventEmitter();
    public OtherSourceResponseEvent:EventEmitter<any>=new EventEmitter();
    public IgnoredResponsesEvent:EventEmitter<any>=new EventEmitter();
    public accountsResponsesEvent:EventEmitter<any>=new EventEmitter();
    public MonsterResponseEvent:EventEmitter<any>=new EventEmitter();
    public JCCandidateResponseEvent:EventEmitter<any>=new EventEmitter();

}