import { Component, OnInit, OnDestroy } from '@angular/core';
import { ShareModule } from '../../shared/share-module';
import { BaseFilter, PaginationResult } from '../../models/base.model';
import { DeviceTypeService } from '../../service/master-data/device-type.service';
import { GlobalService } from '../../service/global.service';

@Component({
  selector: 'app-device-type',
  standalone: true,
  imports: [ShareModule],
  templateUrl: './device-type.component.html',
  styleUrl: './device-type.component.scss',
})
export class DeviceTypeComponent implements OnInit, OnDestroy {
  paginationResult = new PaginationResult();
  loading = false;
  filter = new BaseFilter();
  visible = false;
  isEdit = false;
  item: any = this.initItem();

  constructor(
    private _service: DeviceTypeService,
    private globalService: GlobalService
  ) {
    this.globalService.setBreadcrumb([
      { name: 'Loại thiết bị', path: 'master-data/device-type' },
    ]);
  }

  ngOnInit() {
    this.search();
  }

  ngOnDestroy() {
    this.globalService.setBreadcrumb([]);
  }
  private initItem() {
    return { code: '', name: '', note: '', isActive: true };
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
