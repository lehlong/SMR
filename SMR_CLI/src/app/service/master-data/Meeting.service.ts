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

  create(params: any): Observable<any> {
    return this.commonService.post('Meeting/Insert', params)
  }

  // sendMessage(params: any): Observable<any> {
  //   return this.commonService.get(`DeepSeek/ChatDeepSeek?prompt=${params}`, {}, false)
  // }

  update(params: any): Observable<any> {

    return this.commonService.put('Meeting/Update', params)
  }

  delete(id: string): Observable<any> {
    return this.commonService.delete(`Meeting/Delete/${id}`)
  }

  sendMessage(prompt: string): Observable<string> {
    const url = `https://localhost:4008/api/DeepSeek/ChatDeepSeek?prompt=${encodeURIComponent(prompt)}`;

    return new Observable<string>((observer) => {
      fetch(url).then((response) => {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        const read = () => {
          reader?.read().then(({ done, value }) => {
            if (done) {
              observer.complete();
              return;
            }

            const text = decoder.decode(value, { stream: true });
            observer.next(text); // mỗi chunk là một phần nhỏ
            read(); // tiếp tục đọc
          });
        };

        read();
      }).catch((err) => observer.error(err));
    });
  }

}
