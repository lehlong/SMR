import { Component, Type } from '@angular/core';
import { ShareModule } from '../../shared/share-module';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms'
import { DeviceService } from '../../service/master-data/Device.service';

@Component({
  selector: 'app-device',
  imports: [ShareModule],
  templateUrl: './device.component.html',
  styleUrl: './device.component.scss'
})
export class DeviceComponent {
  validateForm: FormGroup
  paginationResult: any = {};
   filter: any =  {};
   visible: boolean = false;
   isSubmit: boolean = false;
    loading: boolean = false;
  edit: boolean = false;
   constructor(
     
      private fb: NonNullableFormBuilder,
      private _service: DeviceService,
     
    ) {
      this.validateForm= this.fb.group({
        id: [null],
        name: ['', [Validators.required]],
        type: ['', [Validators.required]],
         isActive: [true, [Validators.required]],
      })
     
    }

  ngOnInit() {
    this.search()}

    search() {
      this.isSubmit = false
      
      this._service.search(this.filter).subscribe({
        next: (data) => {
          console.log('day nay',data)
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
    this.edit = true
    this.visible = true
    this.validateForm.patchValue(item)
    
    this.validateForm.get('id')?.setValue(item.id)
    this.validateForm.get('name')?.setValue(item.name)
    this.validateForm.get('type')?.setValue(item.type)
  
  }
  pageIndexChange(index: number): void {}
  pageSizeChange(size: number): void {}
   close() {
      this.visible = false
      this.resetForm()
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
        const formData = this.validateForm.getRawValue();
        if (this.validateForm.valid) {
          const formDataToSend = new FormData();

        console.log('formData', formData)
        
          if (this.edit) {
           
            this._service
              .update(formData)
              .subscribe({
                next: (data) => {
                  this.search()
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
    
  

}
