import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private sessionExpiredSubject = new Subject<void>();
  sessionExpired$ = this.sessionExpiredSubject.asObservable();

  constructor() {}

  getErrorMessage(errorResponse: any): string {
    let errorText = "Server error";

    if (errorResponse) {
      if (errorResponse.status == 404) {
        errorText = '';
      }
      else if (errorResponse.status == 401) {
        errorText = 'Your session is expired';
        this.sessionExpiredSubject.next();
      }
      else if (errorResponse.status == 0) {
        errorText = 'Server is busy, please try after some time';
      }
      else {
        errorText = Object.values(errorResponse.error)[0][0];
      }
    }

    return errorText;
  }
}