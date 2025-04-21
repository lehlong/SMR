import { AfterViewChecked, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ShareModule } from '../../shared/share-module';

@Component({
  selector: 'app-resource',
  imports: [ShareModule],
  standalone: true,
  templateUrl: './resource.component.html',
  styleUrl: './resource.component.scss'
})
export class ResourceComponent implements AfterViewChecked {
  @Input() meetingId: string | null = '';

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  selectedMessage: number | null = null;
  selectMessage(index: number): void {
    this.selectedMessage = index;
  }
  @ViewChild('chatContent') private chatContent!: ElementRef;

  scrollToBottom(): void {
    try {
      this.chatContent.nativeElement.scrollTop =
        this.chatContent.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll error', err);
    }
  }
}
