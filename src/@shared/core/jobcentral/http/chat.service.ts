import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { InitializeChatResponse } from '../model/chatresponsemodel';


  @Injectable({
    providedIn: 'root'
  })
  export class ResumeAnalysisService {
    private contextId: string | null = null;  // To store context ID for session management
    chat_api = environment.APIServerUrl + 'OpenAIChat';

    constructor(private http: HttpClient) {}
  
    // Call to analyze resume content (first-time or follow-up)
    analyzeResume(companyId: number, applicantId: number, messages: { role: string; text: string }[]) {
      let url = `${this.chat_api}/analyze?companyId=${companyId}&applicantId=${applicantId}`;
      
      // Send the request to the backend API
      return this.http.post(url, { messages });
    }

    getResumeContent(companyId: number, applicantId: number): Observable<InitializeChatResponse>{
      let url = `${this.chat_api}/GetResumeText?companyId=${companyId}&applicantId=${applicantId}`;
      return this.http.get<InitializeChatResponse>(url);
    }

    // Store and retrieve context ID for follow-up requests
    setContextId(id: string) {
      this.contextId = id;
    }
  
    getContextId(): string | null {
      return this.contextId;
    }
  }
  
  
