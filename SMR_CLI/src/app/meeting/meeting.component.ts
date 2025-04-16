import {
  Component,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../service/global.service';
import { ShareModule } from '../shared/share-module';
import { DocumentEditorModule } from '@onlyoffice/document-editor-angular';
import { IConfig } from '@onlyoffice/document-editor-angular';
declare var JitsiMeetExternalAPI: any;


@Component({
  selector: 'app-meeting',
  imports: [ShareModule,DocumentEditorModule],
  standalone: true,
  templateUrl: './meeting.component.html',
  styleUrl: './meeting.component.scss',
})
export class MeetingComponent implements AfterViewInit, OnDestroy {
  @ViewChild('jitsiContainer') jitsiContainer!: ElementRef;

  domain: string = 'meet.xbot.vn';
  room: string = 'my-room';
  api: any;
  user: any = {};
  id: string | null = null;
  
  isJitsiInitialized = false;
 idramdom: string = Math.random().toString(36).substring(2, 15);
 documentIdramdom: string = Math.random().toString(36).substring(2, 15);

  constructor(private route: ActivatedRoute, private gService: GlobalService) {
    this.user = this.gService.getUserInfo();
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id');
      if (this.id) this.room = this.id;
    });
  }
  config: IConfig = {
    document: {
      fileType: 'xlsx',
      key: `${this.documentIdramdom}`,
      title: 'Example Document Title.xlsx',
      url: 'http://sso.d2s.com.vn:4455/Upload/08042025_171659_CSTMGG.xlsx',
    },
    documentType: 'cell',
    editorConfig: {
      mode: 'view', 
      
    },}
    onDocumentReady(event: any) {
      console.log('Document is ready:', event);
    }
  
    onLoadComponentError(error: any) {
      console.error('Error loading document editor:', error);
    }
  ngAfterViewInit(): void {
    // Không gọi initializeJitsi ở đây nữa
  }

  onTabChange(index: number): void {
    if (index === 2 && !this.isJitsiInitialized) {
      setTimeout(() => this.initializeJitsi(), 0);
    }
  }
  

  initializeJitsi(): void {
    if (!this.jitsiContainer) {
      console.error('jitsiContainer is not ready');
      return;
    }

    const options = {
      roomName: this.room,
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
        avatarURL:
          'https://localhost:4008/Uploads/Images/2025/04/15/717c04af-29e6-4a7c-8d47-615dd9c946d2.jpg',
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
