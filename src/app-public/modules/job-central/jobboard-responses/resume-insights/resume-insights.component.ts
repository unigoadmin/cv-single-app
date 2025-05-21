import { Component, Inject, OnChanges, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IconService } from 'src/@shared/services/icon.service';
import { ResumeAnalysisService } from '../../core/http/chat.service';
import { LoginUser } from 'src/@shared/models';
import { AuthenticationService } from 'src/@shared/services';
import { AccountTypes } from 'src/static-data/accounttypes';
import { InitializeChatResponse } from '../../core/model/chatresponsemodel';

interface ChatMessage {
  role: 'user' | 'ai' |'system';
  text: string;
  visible?: boolean; 
}

@Component({
  selector: 'cv-resume-insights',
  templateUrl: './resume-insights.component.html',
  styleUrls: ['./resume-insights.component.scss'],
  providers: [AccountTypes]
})
export class ResumeInsightsComponent implements OnInit, OnChanges {

  userInput: string = '';
  prompt: string = '';
  messages: ChatMessage[] = [];
  isLoading: boolean = false;
  isResumeLoading:boolean=false;
  SelectedResponseId: number;
  loginUser: LoginUser;
  SystemPromtList: any[] = [];
  selectedPrompt: string = "";
  selectedPromptId: number; // Default to the first prompt
  // Initialize with the first prompt's value
  constructor(@Inject(MAT_DIALOG_DATA) private dialogData: { responseId: number },
    private http: HttpClient,
    private dialogRef: MatDialogRef<ResumeInsightsComponent>,
    public iconService: IconService,
    private chatService: ResumeAnalysisService,
    private authService: AuthenticationService,
    private accountTypes: AccountTypes

  ) {
    this.SystemPromtList = this.accountTypes.ChatSystemPrompts;
  }

  ngOnInit(): void {
    this.loginUser = this.authService.getLoginUser();
    this.SelectedResponseId = this.dialogData.responseId;
    this.initializeChat(this.loginUser.Company.Id,this.SelectedResponseId);
  }

  ngOnChanges() {
    this.initializeChat(this.loginUser.Company.Id,this.SelectedResponseId);
  }

  initializeChat(companyId: number, applicantId: number) {
    try {
      this.isResumeLoading=true;
      // Fetch resume content from backend
      this.chatService.getResumeContent(companyId, applicantId).subscribe((response: InitializeChatResponse) => {
        // Add AI response to chat context
        this.messages.push({
          role: 'system',
          text: `You are a helpful assistant that can extract and analyze information from resumes. The following is a candidate's resume. Please use this content to answer any follow-up questions about the candidate's background, skills, education, etc.`,
          visible: true
        });
        this.messages.push({
          role: 'system',
          text: `Resume Content: ${response.resumeContent}`,
          visible: false
        });
        this.isResumeLoading=false;
      });
    } catch (error) {
      this.isResumeLoading=false;
      console.error('Error fetching resume content:', error);
    }
  }

  sendMessage(): void {debugger;
    if (this.userInput.trim()) {
      // Add user message to chat context
      this.isLoading=true;
      const userMessage: ChatMessage = { role: 'user', text: this.userInput,visible:true };
      this.messages.push(userMessage);

      // Send context (all messages) to backend
      this.chatService.analyzeResume(this.loginUser.Company.Id, this.SelectedResponseId, this.messages).subscribe(response => {
        // Add AI response to chat context
        const aiMessage: ChatMessage = { role: 'ai', text: response['response'],visible:true };
        this.messages.push(aiMessage);
        this.isLoading=false;
      });

      // Clear user input
      this.userInput = '';
    }
  }

  viewClose() {
    this.dialogRef.close();
  }

  selectPrompt(prompt: { id: number, value: string }): void {
    this.selectedPromptId = prompt.id;
    this.selectedPrompt = prompt.value;
    this.messages.push({
      role: 'system',
      text: `${prompt.value}`,
      visible: false
    });
  }

  formatMessage(text: string): string {
    // Replace newlines with <br> to ensure line breaks are respected
    let formattedText = text.replace(/\n/g, '<br>');

    // Convert text starting with '* ' (bullet points) into <li> tags
    const bulletRegex = /\n\* (.*?)(?=\n|$)/g;  // Match newlines followed by '* '
    formattedText = formattedText.replace(bulletRegex, '<li>$1</li>');

    // Wrap with <ul> tags to create a list
    formattedText = `<ul>${formattedText}</ul>`;

    return formattedText;
  }


}
