import {
  Component,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../service/global.service';
import { ShareModule } from '../shared/share-module';
import {
  DocumentEditorModule,
  IConfig,
} from '@onlyoffice/document-editor-angular';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { MainLayoutComponent } from '../layouts/main-layout/main-layout.component';
import { MeetingService } from '../service/master-data/Meeting.service';
import { ChatBotComponent } from './chat-bot/chat-bot.component';
import { MeetingInfoComponent } from './meeting-info/meeting-info.component';
import { DocumentComponent } from './document/document.component';
import { ResourceComponent } from "./resource/resource.component";

declare var JitsiMeetExternalAPI: any;

@Component({
  selector: 'app-meeting',
  standalone: true,
  imports: [
    ShareModule,
    NzEmptyModule,
    ChatBotComponent,
    MeetingInfoComponent,
    DocumentComponent,
    ResourceComponent
],
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.scss'],
})
export class MeetingComponent implements OnDestroy {
  selectedTabIndex = 0;
  @ViewChild('jitsiContainer') jitsiContainer!: ElementRef;
  domain: string = 'meet.xbot.vn';
  api: any;
  user: any = {};
  meetingId: string | null = '';
  isJitsiInitialized = false;

  constructor(
    private route: ActivatedRoute,
    private gService: GlobalService,
    private layout: MainLayoutComponent,
    private service: MeetingService
  ) {
    this.user = this.gService.getUserInfo();
    this.route.paramMap.subscribe((params) => {
      this.meetingId = params.get('id');
    });
    layout.showMainSidebar = false;
  }

  onTabChange(index: number): void {
    if (index === 4 && !this.isJitsiInitialized) {
      setTimeout(() => this.initializeJitsi(), 0);
    }
  }

  initializeJitsi(): void {
    if (!this.jitsiContainer) {
      console.error('jitsiContainer is not ready');
      return;
    }

    const options = {
      roomName: 'Tên cuộc họp',
      width: '100%',
      parentNode: this.jitsiContainer.nativeElement,
      configOverwrite: {
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        prejoinPageEnabled: false,
      },
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
      },
      userInfo: {
        displayName: this.user.fullName,
      },
    };

    this.api = new JitsiMeetExternalAPI(this.domain, options);
    this.isJitsiInitialized = true;

    this.api.addEventListener('videoConferenceJoined', () => {
      console.log('Đã tham gia vào cuộc họp!');
      this.api.executeCommand('start');
    });

    this.api.addEventListener('readyToClose', () => {
      console.log('Người dùng đã rời phòng');
    });
  }

  ngOnDestroy(): void {
    if (this.api) {
      this.api.dispose();
    }
  }
}
