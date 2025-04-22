import { Injectable } from '@angular/core'
import { CommonService } from '../common.service'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  constructor(private commonService: CommonService) { }

  search(params: any): Observable<any> {

    return this.commonService.get('Device/Search', params)
  }

  getAll(): Observable<any> {
    return this.commonService.get('Device/GetAll')
  }

  create(params: any): Observable<any> {
    console.log('params', params)
    return this.commonService.post('Device/Insert', params)
  }

  update(params: any): Observable<any> {

    return this.commonService.put('Device/Update', params)
  }

  delete(id: string): Observable<any> {
    return this.commonService.delete(`Device/Delete/${id}`)
  }
}
