import { Component, OnDestroy, OnInit, Type } from '@angular/core';
import { ShareModule } from '../../shared/share-module';
import { PaginationResult, BaseFilter } from '../../models/base.model';
import { GlobalService } from '../../service/global.service';
import { DeviceService } from '../../service/master-data/Device.service';
import { DeviceTypeService } from '../../service/master-data/device-type.service';

@Component({
  selector: 'app-device',
  imports: [ShareModule],
  standalone: true,
  templateUrl: './device.component.html',
  styleUrl: './device.component.scss',
})
export class DeviceComponent implements OnInit, OnDestroy {
  paginationResult = new PaginationResult();
  loading = false;
  filter = new BaseFilter();
  visible = false;
  isEdit = false;
  item: any = this.initItem();
  lstDeviceType: any[] = [];

  constructor(
    private _service: DeviceService,
    private _sDeviceType: DeviceTypeService,
    private globalService: GlobalService
  ) {
    this.globalService.setBreadcrumb([
      { name: 'Danh sách thiết bị', path: 'master-data/device' },
    ]);
  }

  ngOnInit() {
    this.search();
    this.getDeviceType();
  }

  getDeviceType() {
    this._sDeviceType.getAll().subscribe({
      next: (data) => (this.lstDeviceType = data),
      error: (err) => console.error(err),
    });
  }
  getDeviceTypeName(code: string) {
    const deviceType = this.lstDeviceType.find((item) => item.code === code);
    return deviceType ? deviceType.name : '';
  }

  ngOnDestroy() {
    this.globalService.setBreadcrumb([]);
  }
  private initItem() {
    return { code: '', name: '', note: '', deviceType: '', isActive: true };
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
    this.isEdit = true;
    this.visible = true;
    this.item = { ...item };
  }

  close() {
    this.visible = false;
    this.item = this.initItem();
  }

  submit() {
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
}
