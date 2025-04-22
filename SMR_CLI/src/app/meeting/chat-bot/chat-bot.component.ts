import { Component, Input, OnInit } from '@angular/core';
import { ShareModule } from '../../shared/share-module';
import { MeetingService } from '../../service/master-data/Meeting.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-chat-bot',
  imports: [ShareModule],
  standalone: true,
  templateUrl: './chat-bot.component.html',
  styleUrl: './chat-bot.component.scss',
})
export class ChatBotComponent implements OnInit {

  @Input() meetingId: string | null = '';
 
  inputChatbot: string = '';
  chatAi : any[] = [];
  isTyping: boolean = false; 
  constructor(private service: MeetingService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    console.log('meetingId', this.meetingId);
  }
  decodeUnicodeEscapes(str: string): string {
    return str.replace(/\\u([a-fA-F0-9]{4})/g, (_, g1) =>
      String.fromCharCode(parseInt(g1, 16))
    );
  }
  removeEmoji(text: string): string {
    this.decodeUnicodeEscapes(text);
    return text.replace(/([\uD800-\uDBFF][\uDC00-\uDFFF])/g, '');
  }
 
  onAskChatbot() {
    this.chatAi.push({
      role: 'User',
      content: this.inputChatbot,
    });

    let aiMessage = {
      role: 'DeepSeek',
      content: ''
    };
    this.chatAi.push(aiMessage);
  

    this.service.sendMessage(this.inputChatbot).subscribe({
      next: (chunk) => {
        
          console.log(chunk)
          const formattedText = this.removeEmoji(chunk)
          .replaceAll('"', '')
          .replaceAll('[', '')
          .replaceAll(']', '')
          .replaceAll(',', '')
          .replace(/\\n/g, '<br>')

    aiMessage.content += formattedText;
       
      },
      error: (err) => {
        console.error('API error:', err);
      }
    });

    this.inputChatbot = '';
  }

}
