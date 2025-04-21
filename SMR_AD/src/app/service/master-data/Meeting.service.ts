import { Injectable } from '@angular/core'
import { CommonService } from '../common.service'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class MeetingService {
  constructor(private commonService: CommonService) { }

  search(params: any): Observable<any> {
    
    return this.commonService.get('Meeting/Search', params)
  }

  getAll(): Observable<any> {
    return this.commonService.get('Meeting/GetAll')
  }
  getAllPeopleMeeting(params: any): Observable<any> {
    return this.commonService.get(`Meeting/GetAllPeopleMeeting?HeaderId=${params}`)
  }
  getFile(params: any): Observable<any> {
    return this.commonService.get('Meeting/GetFile',params)
  }

  create(params: any): Observable<any> {
    console.log('params', params)
    return this.commonService.post('Meeting/Insert', params)
  }

  update(params: any): Observable<any> {
  
    return this.commonService.put('Meeting/Update', params)
  }

  delete(id: string): Observable<any> {
    return this.commonService.delete(`Meeting/Delete/${id}`)
  }
}
