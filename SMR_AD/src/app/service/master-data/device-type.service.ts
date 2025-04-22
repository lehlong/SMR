import { Injectable } from '@angular/core';
import { CommonService } from '../common.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeviceTypeService {
  constructor(private commonService: CommonService) {}

  search(params: any): Observable<any> {
    return this.commonService.get('DeviceType/Search', params);
  }

  getAll(): Observable<any> {
    return this.commonService.get('DeviceType/GetAll');
  }

  create(params: any): Observable<any> {
    console.log('params', params);
    return this.commonService.post('DeviceType/Insert', params);
  }

  update(params: any): Observable<any> {
    return this.commonService.put('DeviceType/Update', params);
  }
}
