import { Component, ElementRef, Type, ViewChild } from '@angular/core';
import { ShareModule } from '../../shared/share-module';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms'
import { MeetingRoomService } from '../../service/master-data/MeetingRoom.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-device',
  imports: [ShareModule],
  templateUrl: './Meeting-room.component.html',
  styleUrl: './Meeting-room.component.scss'
})
export class MeetingRoomComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  validateForm: FormGroup
  paginationResult: any = {};
   filter: any =  {};
   visible: boolean = false;
     avatarBase64: string = ''
   isSubmit: boolean = false;
    loading: boolean = false;
  edit: boolean = false;
  
   constructor(
     
      private fb: NonNullableFormBuilder,
      private _service: MeetingRoomService,
     
    ) {
      this.validateForm= this.fb.group({
        id: [null],
        name: ['', [Validators.required]],
        type: ['', [Validators.required]],
        Size: ['', [Validators.required]],
        Floor: ['', [Validators.required]],
         isActive: [true, [Validators.required]],
         UrlImg: [''],
        
      })
     
    }

  ngOnInit() {
    this.search()}

    search() {
      this.isSubmit = false
      
      this._service.search(this.filter).subscribe({
        next: (data) => {
         console.log(data)
          this.paginationResult = data
        },
        error: (response) => {
          console.log(response)
        },
      })
    }
  
  openCreate(){
    this.edit = false
    this.visible = true
  }

  openEdit(item: any) {
    console.log('item1', item)
    this.edit = true
    this.visible = true
    this.validateForm.patchValue(item)
    
    this.validateForm.get('id')?.setValue(item.id)
    this.validateForm.get('name')?.setValue(item.name)
    this.validateForm.get('type')?.setValue(item.type)
    this.validateForm.get('Size')?.setValue(item.size)
    this.validateForm.get('Floor')?.setValue(item.floor)
    this.validateForm.get('isActive')?.setValue(item.isActive)
    
   this.avatarBase64 = `${environment.urlFiles}\\${item.urlImg}`;;
    console.log('item', this.avatarBase64)
  
  }
  pageIndexChange(index: number): void {}
  pageSizeChange(size: number): void {}
   close() {
      this.visible = false
      this.resetForm()
      this.clearImage()
    }
  
    reset() {
      this.search()
    }
    
    resetForm() {
      this.validateForm.reset()
      this.isSubmit = false
    }
    onSortChange(name: string, value: any) {
      console.log(name, value)
     }
     submitForm(): void {
        this.isSubmit = true
        console.log('submitForm', this.validateForm)
        const formData = this.validateForm.getRawValue();
        if(this.avatarBase64 != '' && this.isBase64Image(this.avatarBase64)){
          formData.imageBase64 = this.avatarBase64
        }
        if (this.validateForm.valid) {
        

        console.log('formData', formData)
        
          if (this.edit) {
           
            this._service
              .update(formData)
              .subscribe({
                next: (data) => {
                  this.search()
                  this.visible = false
                },
                error: (response) => {
                  console.log(response)
                },
              })
          } else {
          
            this._service
              .create(formData)
              .subscribe({
                next: (data) => {
                  
                  this.search()
                },
                error: (response) => {
                  console.log(response)
                },
              })
          }
        } else {
          Object.values(this.validateForm.controls).forEach((control) => {
            if (control.invalid) {
              control.markAsDirty()
              control.updateValueAndValidity({ onlySelf: true })
            }
          })
        }
      }
      onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.avatarBase64 = e.target.result; 
          };
          reader.readAsDataURL(file);
        }
      }
    
      clearImage() {
        this.avatarBase64 = ''; 
        this.fileInput.nativeElement.value = '';
      }
      isBase64Image(str: string): boolean {
        const dataUriPattern = /^data:image\/(png|jpg|jpeg|gif|bmp|webp);base64,/;
        if (!dataUriPattern.test(str)) return false;
        const base64String = str.split(',')[1];
        if (!base64String || base64String.length % 4 !== 0) return false;
        const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
        return base64Regex.test(base64String);
      }
    

}
