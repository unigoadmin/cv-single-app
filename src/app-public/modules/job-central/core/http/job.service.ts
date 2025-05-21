import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { BenchCandidate } from "../model/benchcandidate";

@Injectable({ providedIn: 'root' })
export class JobService {
    private Candidate = new Subject<any>();
    private candidateDetails = new Subject<any>();
    sendCandidate(message: string) {
        this.Candidate.next({ text: message });
    }
    getCandidate(): Observable<any> {
        return this.Candidate.asObservable();
    }
    sendcandidateDetails(message: string) {
        this.candidateDetails.next({text:message});
    }
    getcandidateDetails(): Observable<any> {
        return this.candidateDetails.asObservable();
    }
}