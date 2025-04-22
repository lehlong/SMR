import { Injectable } from '@angular/core';
import { CommonService } from '../common.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MeetingService {
  constructor(private commonService: CommonService) {}

  search(params: any): Observable<any> {
    return this.commonService.get('Meeting/Search', params);
  }

  getAll(): Observable<any> {
    return this.commonService.get('Meeting/GetAll');
  }

  create(params: any): Observable<any> {
    return this.commonService.post('Meeting/Insert', params);
  }

  update(params: any): Observable<any> {
    return this.commonService.put('Meeting/Update', params);
  }
}
