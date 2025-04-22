import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ShareModule } from '../../shared/share-module';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { GlobalService } from '../../service/global.service';
import { AuthService } from '../../service/auth.service';
import * as faceapi from 'face-api.js';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ShareModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  constructor(
    private message: NzMessageService,
    private router: Router,
    private globalService: GlobalService,
    private authService: AuthService
  ) {}
  @ViewChild('video') videoElement!: ElementRef<HTMLVideoElement>;
  private stream: MediaStream | null = null;
  model = {
    userName: '',
    password: '',
  };
  hasFace: boolean = false;

  ngOnInit() {
    this.loadModels();
  }
  async loadModels() {
    await faceapi.nets.ssdMobilenetv1.loadFromUri('models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('models');
  }
  async detectFaceContinuously() {
    const video = this.videoElement.nativeElement;

    video.addEventListener('play', async () => {
      const canvas = faceapi.createCanvasFromMedia(video);
      document.body.append(canvas);

      const displaySize = {
        width: video.videoWidth,
        height: video.videoHeight,
      };
      faceapi.matchDimensions(canvas, displaySize);

      setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video);
        const hasFace = detections.length > 0;

        if (hasFace) {
          const imageBlob = this.captureImage();
          const base64 = await this.blobToBase64(imageBlob);
          this.processLoginFace(base64);

        }

        this.hasFace = hasFace;
      }, 1000);
    });
  }
  blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
  startWebcam() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          this.stream = stream;
          this.videoElement.nativeElement.srcObject = stream;
        })
        .catch((err) => {
          console.error('Không thể truy cập webcam: ', err);
        });
    } else {
      alert('Trình duyệt không hỗ trợ webcam.');
    }
    this.detectFaceContinuously();
  }
  stopWebcam() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.videoElement.nativeElement.srcObject = null;
      this.stream = null;
    }
  }
  captureImage(): Blob {
    const video = this.videoElement.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg');
    const byteString = atob(dataUrl.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const intArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
    }

    return new Blob([intArray], { type: 'image/jpeg' });
  }

  processLogin() {
    if (this.model.userName == '' || this.model.password == '') {
      this.message.create(
        'error',
        `Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!`
      );
      return;
    }
    this.authService.login(this.model).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        this.globalService.setUserInfo(response.accountInfo);
        localStorage.setItem('openSidebar', 'true');
        localStorage.setItem(
          'companyCode',
          response?.accountInfo?.organizeCode
        );
        localStorage.setItem(
          'warehouseCode',
          response?.accountInfo?.warehouseCode
        );
        const userName = response?.accountInfo?.userName;
        if (userName) {
          this.globalService.setUserName(userName);
        }
        this.authService
          .getRightOfUser({ userName: response?.accountInfo?.userName })
          .subscribe({
            next: (rights) => {
              this.globalService.setRightData(JSON.stringify(rights || []));
              this.router.navigate(['/']);
            },
            error: (error) => {
              this.message.create(
                'error',
                `Lỗi không lấy được danh sách quyền của user!`
              );
              console.log('Lỗi hệ thống:', error);
            },
          });
      },
      error: (error) => {
        this.message.create('error', `Tên đăng nhập hoặc mật khẩu không đúng!`);
        console.log(error);
      },
    });
  }

  processLoginFace(base64Image: any) {
    this.authService.loginFace(base64Image).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        this.globalService.setUserInfo(response.accountInfo);
        localStorage.setItem('openSidebar', 'true');
        localStorage.setItem(
          'companyCode',
          response?.accountInfo?.organizeCode
        );
        localStorage.setItem(
          'warehouseCode',
          response?.accountInfo?.warehouseCode
        );
        const userName = response?.accountInfo?.userName;
        if (userName) {
          this.globalService.setUserName(userName);
        }
        this.authService
          .getRightOfUser({ userName: response?.accountInfo?.userName })
          .subscribe({
            next: (rights) => {
              this.globalService.setRightData(JSON.stringify(rights || []));
              this.stopWebcam();
              this.router.navigate(['/']);
            },
            error: (error) => {
              this.message.create(
                'error',
                `Lỗi không lấy được danh sách quyền của user!`
              );
              console.log('Lỗi hệ thống:', error);
            },
          });
      },
      error: (error) => {
        //this.message.create('error', `Hệ thống không nhận diện được! Vui lòng thử lại!`);
        console.log(error);
      },
    });
  }
}
