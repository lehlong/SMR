import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeepSeekService {
  private apiUrl = 'https://openrouter.ai/api/v1/chat/completions';

  // Đảm bảo API key chính xác
  private apiKey = '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';

  constructor(private http: HttpClient) { }

  generateTextFree(prompt: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.href || 'http://localhost:4200',
      'X-Title': 'My Angular App'
    });

    const body = {
      model: "deepseek-chat",
      messages: [
        { role: "user", content: prompt }
      ]
    };

    return this.http.post(this.apiUrl, body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // CÁCH 2: Dùng model có API key
  generateTextWithKey(prompt: string, apiKey: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.href || 'http://localhost:4200',
      'X-Title': 'My Angular App'
    });

    const body = {
      model: "deepseek-chat",
      messages: [
        { role: "user", content: prompt }
      ]
    };

    return this.http.post(this.apiUrl, body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('Chi tiết lỗi API:', error);
    let errorMessage = `Lỗi: ${error.status || 'Unknown'}`;

    if (error.status === 401) {
      errorMessage += ' - Xác thực thất bại. Kiểm tra lại API Key hoặc sử dụng chế độ free (không cần key)';
    }

    return throwError(() => new Error(errorMessage));
  }
}
