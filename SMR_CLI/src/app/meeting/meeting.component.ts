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
import { DocumentEditorModule, IConfig } from '@onlyoffice/document-editor-angular';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { MainLayoutComponent } from '../layouts/main-layout/main-layout.component';
import { DeepSeekService } from '../service/deepseek.service';
import { MeetingService } from '../service/master-data/Meeting.service';

declare var JitsiMeetExternalAPI: any;

@Component({
  selector: 'app-meeting',
  standalone: true,
  imports: [ShareModule, DocumentEditorModule, NzEmptyModule],
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.scss'],
})
export class MeetingComponent implements OnDestroy, AfterViewChecked  {
  @ViewChild('jitsiContainer') jitsiContainer!: ElementRef;

  domain: string = 'meet.xbot.vn';
  room: string = 'my-room';
  api: any;
  user: any = {};
  id: string | null = null;

  isJitsiInitialized = false;
  isDocumentTabVisible = false;
  renderEditor = false;

  idramdom: string = Math.random().toString(36).substring(2, 15);
  documentIdramdom: string = Math.random().toString(36).substring(2, 15);

  constructor(private route: ActivatedRoute,
    private gService: GlobalService,
     private layout : MainLayoutComponent,
     private service : MeetingService) {
    this.user = this.gService.getUserInfo();
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id');
      if (this.id) this.room = this.id;
    });
    layout.showMainSidebar = false;
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
    },
  };

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  //#region Tab Thành viên
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
  //#endregion

  //#region Chatbot

  inputChatbot: string = '';
  chatAi : any[] = [];
  onAskChatbot() {
    this.chatAi.push({
      role: 'User',
      content: this.inputChatbot,
    });
    this.service.sendMessage(this.inputChatbot)
    .subscribe({
      next: (result) => {
        result.content = result.content.replaceAll('**', '<br>');
        this.chatAi.push(result)
      },
      error: (err) => {
        console.error('API error:', err);
      }
    });
    this.inputChatbot = '';
  }
  //#endregion

  onDocumentReady(event: any) {
    console.log('Document is ready:', event);
  }

  onLoadComponentError(error: any) {
    console.error('Error loading document editor:', error);
  }

  onTabChange(index: number): void {
    this.isDocumentTabVisible = index === 1;

    if (this.isDocumentTabVisible && !this.renderEditor) {
      setTimeout(() => {
        this.renderEditor = true;
      }, 100); // delay nhỏ để đảm bảo DOM đã sẵn sàng
    }

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

  tabs: any[] = [];
  selectedIndex = 0;

  trackByTabId(index: number, tab: any): string {
    return tab.id;
  }

  closeTab({ index }: { index: number }): void {
    this.tabs.splice(index, 1);
  }

  newTab(fileName: string): void {
    // Lấy phần mở rộng của tệp tin
    const extension = fileName.split('.').pop()?.toLowerCase();

    // Nếu extension là undefined, mặc định sử dụng 'word'
    const typeMap: any = {
      docx: 'word',
      xlsx: 'cell',
      pptx: 'slide',
      pdf: 'word',
      txt: 'word',
    };

    // Nếu extension là undefined, ta sử dụng 'word' làm mặc định
    const fileType =
      extension && typeMap[extension] ? typeMap[extension] : 'word';

    // Tạo id mới cho tab
    const newId = Math.random().toString(36).substring(2, 15);

    // Tạo tab mới
    const tab = {
      title: fileName,
      id: newId,
      config: {
        document: {
          fileType: extension,
          key: newId,
          title: fileName,
          url: `http://sso.d2s.com.vn:4455/Upload/08042025_171659_CSTMGG.xlsx`,
        },
        documentType: fileType,
        editorConfig: {
          mode: 'view',
        },
      },
    };

    // Thêm tab vào danh sách
    this.tabs.push(tab);
    this.selectedIndex = this.tabs.length - 1;
  }
}
