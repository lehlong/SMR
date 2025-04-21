import { Component, Input } from '@angular/core';
import { ShareModule } from '../../shared/share-module';
import { DocumentEditorModule } from '@onlyoffice/document-editor-angular';

@Component({
  selector: 'app-document',
  imports: [ShareModule, DocumentEditorModule],
  standalone: true,
  templateUrl: './document.component.html',
  styleUrl: './document.component.scss',
})
export class DocumentComponent {
  @Input() meetingId: string | null = '';
  tabs: any[] = [];
  selectedIndex = 0;



  trackByTabId(index: number, tab: any): string {
    return tab.id;
  }

  closeTab({ index }: { index: number }): void {
    this.tabs.splice(index, 1);
  }

  openDocument(fileName: string): void {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const typeMap: any = {
      docx: 'word',
      xlsx: 'cell',
      pptx: 'slide',
      pdf: 'word',
      txt: 'word',
    };
    const fileType =
      extension && typeMap[extension] ? typeMap[extension] : 'word';
    const newId = Math.random().toString(36).substring(2, 15);

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
    this.tabs.push(tab);
    this.selectedIndex = this.tabs.length - 1;
  }
}
