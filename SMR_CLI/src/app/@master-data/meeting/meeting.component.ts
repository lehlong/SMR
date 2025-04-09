import { Component } from '@angular/core';
import { ShareModule } from '../../shared/share-module';
import { PaginationResult } from '../../models/base.model'
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms'
import { AccountTypeFilter } from '../../models/master-data/account-type.model'
import { DropdownService } from '../../service/dropdown/dropdown.service'
import { MeetingService } from '../../service/master-data/Meeting.service';
import { NzMessageService } from 'ng-zorro-antd/message'
import { id_ID } from 'ng-zorro-antd/i18n';
@Component({
  selector: 'app-create-meeting',
  standalone: true,
  imports: [ShareModule],
  templateUrl: './meeting.component.html',
  styleUrl: './meeting.component.scss'
})
export class CreateMettingComponent {
  paginationResult = new PaginationResult()
 filter = new AccountTypeFilter()
 isSubmit: boolean = false
  visible: boolean = false
  edit: boolean = false
  DataAccount: any= []
  loading: boolean = false
 validateForm: FormGroup
 filteredParticipants: any[] = [];

 constructor(
  private fb: NonNullableFormBuilder,
  private dropdownService: DropdownService,
  private _service: MeetingService,
  private message: NzMessageService,
   ) {
    this.validateForm = this.fb.group({
      id: [''],
      MeetingTitle: ['', [Validators.required]],
      time: [null, [Validators.required]],
      chairperson: ['', [Validators.required]],

      isActive: [true, [Validators.required]] })
   }
   ngOnInit(): void {
    this.search()
   this.getAllAccount();
   }


  resetForm() {
    this.validateForm.reset()
    this.isSubmit = false
  }
  openCreate() {
    this.edit = false
    this.visible = true
  }
  onSortChange(name: string, value: any) {
   console.log(name, value)
  }
  close() {
    this.visible = false
    this.resetForm()
  }
  isCodeExist(code: string): boolean {
    return this.paginationResult.data?.some(
      (accType: any) => accType.id === code,
    )
  }
  submitForm(): void {
    this.isSubmit = true
    if (this.validateForm.valid) {
      if (this.edit) {
        console.log(this.validateForm.getRawValue())
        this._service
          .update(this.validateForm.getRawValue())
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
          .create(this.validateForm.getRawValue())
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
  search() {
    this.isSubmit = false
    console.log(this.isSubmit)
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
  reset() {}
openEdit(item: any) {
  this.edit = true  
  console.log(item)
  this.visible = true
  this.validateForm.patchValue(item)
  this.validateForm.get('time')?.setValue(item.time ? new Date(item.time) : null)
  this.validateForm.get('MeetingTitle')?.setValue(item.meetingTitle)
  this.validateForm.get('chairperson')?.setValue(item.chairPerson)
  this.validateForm.get('isActive')?.setValue(item.isActive)
  this.validateForm.get('id')?.setValue(item.id)
  console.log(item)
}
  openDelete() {}
  pageIndexChange(index: number): void {
    
  }
  pageSizeChange(size: number): void {
   
  }
  onChange(result: Date): void {
    console.log('Selected Time: ', result);
  }

  onOk(result: Date | Date[] | null): void {
    console.log('onOk', result);
  }

  onCalendarChange(result: Array<Date | null>): void {
    console.log('onCalendarChange', result);
  }
  getAllAccount(listUser: any = []): void {
    this.dropdownService.GetAllAccount().subscribe({
      next: (data) => {
       this.DataAccount = data
       this.filteredParticipants = [...data];
       console.log(this.DataAccount)
      },
      error: (response) => {
        console.log(response)
      },
    })
  }
}
