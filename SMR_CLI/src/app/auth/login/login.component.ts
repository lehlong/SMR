import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ShareModule } from '../../shared/share-module';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { GlobalService } from '../../service/global.service';
import { AuthService } from '../../service/auth.service';
import { NonNullableFormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ShareModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  tabs = ["FaceID", "Tài Khoản"];
    private fb = inject(NonNullableFormBuilder);
    activeTabIndex = 0; // Track active tab
    validateForm = this.fb.group({
      username: this.fb.control('', [Validators.required]),
      password: this.fb.control('', [Validators.required]),
      remember: this.fb.control(true)
    });
  
    @ViewChild('videoElement') videoElement!: ElementRef;
  
    cameraActive = false;
    isProcessing = false;
    errorMessage = '';
  
    startCamera() {
      this.errorMessage = '';
      
      if (this.cameraActive) {
      
        const video = this.videoElement.nativeElement as HTMLVideoElement;
        const stream = video.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        video.srcObject = null;
        this.cameraActive = false;
        return;
      }
      
     
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          const video = this.videoElement.nativeElement as HTMLVideoElement;
          video.srcObject = stream;
          this.cameraActive = true;
          
         
        })
        .catch(err => {
          this.errorMessage = 'Không thể kết nối máy ảnh: ' + err.message;
          console.error('Error accessing camera:', err);
        });
    }
}
