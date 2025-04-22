import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { PaginationResult, BaseFilter } from '../../models/base.model';
import { GlobalService } from '../../service/global.service';
import { RoomService } from '../../service/master-data/room.service';
import { ShareModule } from '../../shared/share-module';
import { environment } from '../../../environments/environment';
import { DeviceService } from '../../service/master-data/Device.service';

@Component({
  selector: 'app-room',
  imports: [ShareModule],
  templateUrl: './room.component.html',
  styleUrl: './room.component.scss',
})
export class RoomComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef;
  paginationResult = new PaginationResult();
  loading = false;
  filter = new BaseFilter();
  visible = false;
  isEdit = false;
  item: any = this.initItem();
  imageBase64: string = '';
  lstDevice: any[] = [];

  constructor(
    private _service: RoomService,
    private _sDevice: DeviceService,
    private globalService: GlobalService
  ) {
    this.globalService.setBreadcrumb([
      { name: 'Phòng họp', path: 'master-data/meeting-room' },
    ]);
  }

  ngOnInit() {
    this.search();
    this.getDevice();
  }
  getDevice() {
    this._sDevice.getAll().subscribe({
      next: (data) => (this.lstDevice = data),
      error: (err) => console.error(err),
    });
  }

  ngOnDestroy() {
    this.globalService.setBreadcrumb([]);
  }
  private initItem() {
    return {
      code: '',
      name: '',
      address: '',
      filePath: '',
      note: '',
      listDevice: [],
      isActive: true,
    };
  }

  search() {
    this._service.search(this.filter).subscribe({
      next: (data) => (this.paginationResult = data),
      error: (err) => console.error(err),
    });
  }

  onPageChange(index: number, size?: number): void {
    this.filter.currentPage = index;
    if (size !== undefined) this.filter.pageSize = size;
    this.search();
  }

  reset() {
    this.filter = new BaseFilter();
    this.search();
  }

  openCreate() {
    this.isEdit = false;
    this.visible = true;
    this.item = this.initItem();
  }

  openEdit(item: any) {
    this._service.getDeviceRoom(item.code).subscribe({
      next: (data) => {
        this.isEdit = true;
        this.visible = true;
        this.item = { ...item };
        this.item.listDevice = data;
        this.imageBase64 = environment.urlFiles + item.filePath;
      },
      error: (err) => console.error(err),
    });
  }

  close() {
    this.visible = false;
    this.item = this.initItem();
  }

  pushItemToListDevice() {
    this.item.listDevice = [
      ...this.item.listDevice,
      {
        code: '',
        roomCode: this.item.code,
        deviceCode: '',
        quantity: 0,
        isActive: true,
      },
    ];
  }

  submit() {
    if (
      this.imageBase64 != '' &&
      this.globalService.isBase64Image(this.imageBase64)
    ) {
      this.item.filePath = this.imageBase64;
    }
    if (this.item.listDevice.length > 0) {
      this.item.listDevice = this.item.listDevice;
    } else {
      this.item.listDevice = [];
    }
    const request = this.isEdit
      ? this._service.update(this.item)
      : this._service.create(this.item);

    request.subscribe({
      next: () => {
        this.search();
        this.close();
      },
      error: (err) => console.error(err),
    });
  }

  clearImage() {
    this.imageBase64 = '';
    this.fileInput.nativeElement.value = '';
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageBase64 = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
