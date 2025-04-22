import { Component, Input, OnInit } from '@angular/core';
import { ShareModule } from '../../shared/share-module';
import { MeetingService } from '../../service/master-data/Meeting.service';

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

  constructor(private service: MeetingService) {}

  ngOnInit(): void {
    console.log('meetingId', this.meetingId);
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
        aiMessage.content += chunk.replaceAll('\n', '<br>');
      },
      error: (err) => {
        console.error('API error:', err);
      }
    });

    this.inputChatbot = '';
  }

}
