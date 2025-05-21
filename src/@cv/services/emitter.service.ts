import { EventEmitter } from '@angular/core';

export class EmitterService {
  private static _emitters: { [channel: string]: EventEmitter<any> } = {};
  static get(channel: string): EventEmitter<any> {
    if (!this._emitters[channel])
      this._emitters[channel] = new EventEmitter();
    return this._emitters[channel];
  }
  private static _editemitter: { [channel: string]: EventEmitter<any> } = {};
  static benchsummary(channel: string): EventEmitter<any> {
    if (!this._editemitter[channel])
      this._editemitter[channel] = new EventEmitter();
    return this._editemitter[channel];
  }
  private static _scheduleemitter: { [channel: string]: EventEmitter<any> } = {};
  static schedule(channel: string): EventEmitter<any> {
    if (!this._scheduleemitter[channel])
      this._scheduleemitter[channel] = new EventEmitter();
    return this._scheduleemitter[channel];
  }
  private static _candidateemitter: { [channel: string]: EventEmitter<any> } = {};
  static candidate(channel: string): EventEmitter<any> {
    if (!this._candidateemitter[channel])
      this._candidateemitter[channel] = new EventEmitter();
    return this._candidateemitter[channel];
  }
  private static _submitemitter: { [channel: string]: EventEmitter<any> } = {};
  static submitto(channel: string): EventEmitter<any> {
    if (!this._submitemitter[channel])
      this._submitemitter[channel] = new EventEmitter();
    return this._submitemitter[channel];
  }
  private static _submissionemitter: { [channel: string]: EventEmitter<any> } = {};
  static SubmissionId(channel: string): EventEmitter<any> {
    if (!this._submissionemitter[channel])
      this._submissionemitter[channel] = new EventEmitter();
    return this._submissionemitter[channel];
  }
  private static _caneditemitter: { [channel: string]: EventEmitter<any> } = {};
  static canedit(channel: string): EventEmitter<any> {
    if (!this._caneditemitter[channel])
      this._caneditemitter[channel] = new EventEmitter();
    return this._caneditemitter[channel];
  }
  private static _employeemitter: { [channel: string]: EventEmitter<any> } = {};
  static employe(channel: string): EventEmitter<any> {
    if (!this._employeemitter[channel])
      this._employeemitter[channel] = new EventEmitter();
    return this._employeemitter[channel];
  }
  private static _salesemitter: { [channel: string]: EventEmitter<any> } = {};
  static sales(channel: string): EventEmitter<any> {
    if (!this._salesemitter[channel])
      this._salesemitter[channel] = new EventEmitter();
    return this._salesemitter[channel];
  }
  private static _interviewsemitter: { [channel: string]: EventEmitter<any> } = {};
  static interviews(channel: string): EventEmitter<any> {
    if (!this._interviewsemitter[channel])
      this._interviewsemitter[channel] = new EventEmitter();
    return this._interviewsemitter[channel];
  }
  private static _benchAccountsemitter: { [channel: string]: EventEmitter<any> } = {};
  static benchContactJobs(channel: string): EventEmitter<any> {
    if (!this._benchAccountsemitter[channel])
      this._benchAccountsemitter[channel] = new EventEmitter();
    return this._benchAccountsemitter[channel];
  }
  
    private static _authemitter: { [channel: string]: EventEmitter<any> } = {};
  static authemitter(channel: string): EventEmitter<any> {
    if (!this._authemitter[channel])
      this._authemitter[channel] = new EventEmitter();
    return this._authemitter[channel];
  }

    private static _jobemitter: { [channel: string]: EventEmitter<any> } = {};
  static jobemitter(channel: string): EventEmitter<any> {
    if (!this._jobemitter[channel])
      this._jobemitter[channel] = new EventEmitter();
    return this._jobemitter[channel];
  }

    private static _paymentemitter: { [channel: string]: EventEmitter<any> } = {};
  static paymentemitter(channel: string): EventEmitter<any> {
    if (!this._paymentemitter[channel])
      this._paymentemitter[channel] = new EventEmitter();
    return this._paymentemitter[channel];
  }
  private static _benchcandemitter: { [channel: string]: EventEmitter<any> } = {};
  static benchcandemitter(channel: string): EventEmitter<any> {
    if (!this._benchcandemitter[channel])
      this._benchcandemitter[channel] = new EventEmitter();
    return this._benchcandemitter[channel];
  }
  private static _courseemitter: { [channel: string]: EventEmitter<any> } = {};
  static courseemitter(channel: string): EventEmitter<any> {
    if (!this._courseemitter[channel])
      this._courseemitter[channel] = new EventEmitter();
    return this._courseemitter[channel];
  }
  private static _rcemitter: { [channel: string]: EventEmitter<any> } = {};
  static rcemitter(channel: string): EventEmitter<any> {
    if (!this._rcemitter[channel])
      this._rcemitter[channel] = new EventEmitter();
    return this._rcemitter[channel];
  }
}