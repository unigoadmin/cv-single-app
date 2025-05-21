import { Injectable } from '@angular/core';
import {
    HttpClient,
    HttpHeaders,
    HttpErrorResponse,
    HttpParams,
} from '@angular/common/http';

import { Observable, throwError, observable } from 'rxjs';
import { retry, map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ApiResponse } from '../models/apiresponse';

@Injectable({
    providedIn: 'root'
})
export class APIService {

    private headers: HttpHeaders;
    private httpParams: HttpParams;

    constructor(private http: HttpClient, private router: Router) {

    }

    getBlob(url: string, params?: any): Observable<Response> {
        return this.http.get(url, { responseType: 'blob' }).pipe(
            map((res: Blob) => {
                return res;
            }),
            catchError(this.handleError.bind(this))
        );
    }


    get(url: string, params?: any): Observable<Response> {
        return this.http.get(url).pipe(
            map((res: Response) => {
                return res;
            }),
            catchError(this.handleError.bind(this))
        );
    }

    getString(url: string, params?: any): Observable<any> {
        return this.http.get(url, { responseType: 'text' }).pipe(
            map((res: any) => {
                return res;
            }),
            catchError(this.handleError.bind(this))
        );
    }

    post(url: string, data: any, params?: any): Observable<ApiResponse> {
        return this.doPost(url, data, params);
    }

    put(url: string, data: any, params?: any): Observable<ApiResponse> {
        return this.doPut(url, data, params);
    }

    private doPost(url: string, data: any, params?: any): Observable<ApiResponse> {
        const options = {};
        this.setHeaders(options, params);

        return this.http.post(url, data, options).pipe(
            map((res: Response) => {
                return res;
            }),
            catchError(this.handleError.bind(this))
        );
    }

    private doPut(url: string, data: any, params?: any): Observable<ApiResponse> {
        const options = {};
        this.setHeaders(options, params);

        return this.http.put(url, data, options).pipe(
            map((res: Response) => {
                return res;
            }),
            catchError(this.handleError.bind(this))
        );
    }

    private handleError(error: any): Observable<any> {
        if (error.error instanceof ErrorEvent) {
            console.error('Client side network error occurred:', error.error.message);
            return error;
        } else {
            const respError = error as HttpErrorResponse;
            if (respError && respError.status === 401) {
                this.router.navigate(['unauthorized']);
            } else if (respError && respError.status === 403) {
                this.router.navigate(['forbidden']);
            }


        }
        return throwError(error || 'server error');
    }

    private setHeaders(options, params?): void {
        this.headers = new HttpHeaders();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');

        this.httpParams = new HttpParams();

        if (params) {
            this.httpParams.append('id', params.id);
        }

        options['headers'] = this.headers;
    }



}