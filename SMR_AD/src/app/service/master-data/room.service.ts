import { Injectable } from '@angular/core';
import { CommonService } from '../common.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  constructor(private commonService: CommonService) {}

  search(params: any): Observable<any> {
    return this.commonService.get('Room/Search', params);
  }

  getAll(): Observable<any> {
    return this.commonService.get('Room/GetAll');
  }

  getDeviceRoom(code : string): Observable<any> {
    return this.commonService.get(`Room/GetDeviceByRoom?roomCode=${code}`);
  }

  create(params: any): Observable<any> {
    return this.commonService.post('Room/Insert', params);
  }

  update(params: any): Observable<any> {
    return this.commonService.put('Room/Update', params);
  }
}
