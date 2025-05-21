// session-alert.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionAlertService {
  private showAlertSubject = new BehaviorSubject<boolean>(false);
  showAlert$: Observable<boolean> = this.showAlertSubject.asObservable();

  showSessionAlert() {
    this.showAlertSubject.next(true);
  }

  hideSessionAlert() {
    this.showAlertSubject.next(false);
  }
}