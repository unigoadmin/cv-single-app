import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { SelectItem } from 'src/@shared/models/common/selectitem';
import { WCApiResponse } from 'src/@shared/core/wc/models/wc-apiresponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkStatusService {
  private workStatusFieldsSubject = new BehaviorSubject<SelectItem[]>([]);
  private workStatusFieldsCache: SelectItem[] | null = null;
  private apiUrl = `${environment.APIServerUrl}Settings`;

  constructor(private http: HttpClient) {}

  getWorkStatusFields(companyId: number): Observable<SelectItem[]> {
    // Return cached data if available
    if (this.workStatusFieldsCache) {
      return of(this.workStatusFieldsCache);
    }

    // Otherwise fetch from API and cache the result
    return this.http.get<WCApiResponse>(`${this.apiUrl}/GetWorkPermitsByCompanyIdForSelect/${companyId}`).pipe(
      map((response: WCApiResponse) => response.Data as SelectItem[]),
      tap(data => {
        this.workStatusFieldsCache = data;
        this.workStatusFieldsSubject.next(data);
      })
    );
  }

  // Clear cache if needed (e.g., when company changes)
  clearCache(): void {
    this.workStatusFieldsCache = null;
  }
} 