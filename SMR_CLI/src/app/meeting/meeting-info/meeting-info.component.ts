import { Component, Input, OnInit } from '@angular/core';
import { ShareModule } from '../../shared/share-module';

@Component({
  selector: 'app-meeting-info',
  imports: [ShareModule],
  standalone: true,
  templateUrl: './meeting-info.component.html',
  styleUrl: './meeting-info.component.scss'
})
export class MeetingInfoComponent implements OnInit {
  @Input() meetingId: string | null = '';
  ngOnInit(): void {
    console.log('meetingId', this.meetingId);
  }
}
