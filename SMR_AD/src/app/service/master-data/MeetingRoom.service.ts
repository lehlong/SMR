import { Injectable } from '@angular/core'
import { CommonService } from '../common.service'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class MeetingRoomService {
  constructor(private commonService: CommonService) { }

  search(params: any): Observable<any> {
    
    return this.commonService.get('MeetingRoom/Search', params)
  }

  getAll(): Observable<any> {
    return this.commonService.get('MeetingRoom/GetAll')
  }



  create(params: any): Observable<any> {
    console.log('params', params)
    return this.commonService.post('MeetingRoom/Insert', params)
  }

  update(params: any): Observable<any> {
  
    return this.commonService.put('MeetingRoom/Update', params)
  }

  delete(id: string): Observable<any> {
    return this.commonService.delete(`MeetingRoom/Delete/${id}`)
  }
}
