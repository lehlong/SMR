import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecordService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private audioContext!: AudioContext;
  private analyser!: AnalyserNode;
  private source!: MediaStreamAudioSourceNode;
  private silenceTimer: any;
  private silenceThreshold = 0.01;
  private silenceDuration = 2000;
  private stream!: MediaStream;

  public onRecordingComplete = new Subject<Blob>();

  private isRecording = false;

  constructor(private http: HttpClient) { }

  async startRecording() {
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.audioChunks = [];

    this.audioContext = new AudioContext();
    this.source = this.audioContext.createMediaStreamSource(this.stream);
    this.analyser = this.audioContext.createAnalyser();
    this.source.connect(this.analyser);

    this.mediaRecorder = new MediaRecorder(this.stream);
    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) this.audioChunks.push(e.data);
    };

    this.mediaRecorder.onstop = () => {
      this.stream.getTracks().forEach((track) => track.stop());
      this.audioContext.close();

      const blob = new Blob(this.audioChunks, { type: 'audio/webm' });
      this.onRecordingComplete.next(blob);
      this.speechToText(blob);
    };

    this.isRecording = true;
    this.mediaRecorder.start();
    this.detectSilence();
  }

  private detectSilence() {
    const dataArray = new Uint8Array(this.analyser.fftSize);

    const checkSilence = () => {
      if (!this.isRecording) return;

      this.analyser.getByteTimeDomainData(dataArray);
      const normalized = dataArray.map((val) => (val - 128) / 128);
      const avg = normalized.reduce((a, b) => a + Math.abs(b), 0) / normalized.length;

      if (avg < this.silenceThreshold) {
        if (!this.silenceTimer) {
          this.silenceTimer = setTimeout(() => {
            this.stopRecording();
          }, this.silenceDuration);
        }
      } else {
        if (this.silenceTimer) {
          clearTimeout(this.silenceTimer);
          this.silenceTimer = null;
        }
      }

      requestAnimationFrame(checkSilence);
    };

    checkSilence();
  }

  stopRecording() {
    this.isRecording = false;
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      this.mediaRecorder = null;
    }
  }

  private speechToText(blob: Blob) {
    const formData = new FormData();
    formData.append('file', blob, 'audio.webm');
    formData.append('model', 'whisperx-1');
    formData.append('language', 'auto');
    formData.append('response_format', 'json');
    formData.append('temperature', '0');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${environment.keyToken}`,
      'X-Bypass-Auth': 'true',
    });

    this.http.post(`${environment.urlStt}v1/audio/transcriptions`, formData, { headers })
      .subscribe({
        next: (res: any) => {
          console.log(res)
          if (res.text != null && res.text != '' && res.text != undefined) {
            this.http.post(`${environment.urlAi}ai-workflow/control-command`, { "command": res.text }, { headers }).subscribe({
              next: (task_id: any) => {
                console.log(task_id)
                if (task_id.task_id != null && task_id.task_id != '' && task_id.task_id != undefined) {
                  this.http.get(`${environment.urlAi}?task_id=${task_id.task_id}`, { headers }).subscribe({
                    next: (data) => {
                      console.log(data)
                    }
                  })
                }
              }
            })
          }
        },
        error: (err) => console.error(err)
      });
  }

}
