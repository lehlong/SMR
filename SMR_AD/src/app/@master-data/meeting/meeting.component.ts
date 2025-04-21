import { Component } from '@angular/core';
import { ShareModule } from '../../shared/share-module';
import { PaginationResult } from '../../models/base.model'
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms'
import { AccountTypeFilter } from '../../models/master-data/account-type.model'
import { DropdownService } from '../../service/dropdown/dropdown.service'
import { MeetingService } from '../../service/master-data/Meeting.service'
import { differenceInCalendarDays, setHours } from 'date-fns';
import { NzMessageService } from 'ng-zorro-antd/message'
import { id_ID } from 'ng-zorro-antd/i18n';
import { DisabledTimeFn } from 'ng-zorro-antd/date-picker';
import { ListAccount, ItemData,listTranfer} from '../../models/system-manager/account-group.model'
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { MeetingRoomService  } from '../../service/master-data/MeetingRoom.service';
@Component({
  selector: 'app-create-meeting',
  standalone: true,
  imports: [ShareModule],
  templateUrl: './meeting.component.html',
  styleUrl: './meeting.component.scss'
})
export class MettingComponent {
  paginationResult = new PaginationResult()
 filter = new AccountTypeFilter()
 isSubmit: boolean = false
  visible: boolean = false
  edit: boolean = false
  DataAccount: any= []
  listOfAccount: any = []
  i = 0;
  size :number=0
  editId: string | null = null;
  listOfData: ItemData[] = [];
  listOfDataDetail: any[] = [];
  MeetingRoom: any[] = [];
  charPerson: string = ''
  originalDataAccount: any = [];
  loading: boolean = false
 validateForm: FormGroup
 filteredParticipants: any[] = [];
 MeetingRoomId: string = ''
 disabled = false;
 showSearch = false;
 fileList: File[] = [];
 paginatedFileList: File[] = []; 
 selectedPosition: listTranfer[]=[];
 NameMetting :any[] = []
 secretary: string = ''
pageSize: number = 5; 
currentPage: number = 1
 meetingSize = 10;
 dataPaticipants: any[] = []
 listfieupdate: any[] = []

 listOfParticipants: { userName: string| null; position: number }[] = [];
 today = new Date()
 editCache: { [key: string]: { edit: boolean; data: ItemData} } = {};
 
 range(start: number, end: number): number[] {
  const result: number[] = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

 constructor(
  private fb: NonNullableFormBuilder,
  private dropdownService: DropdownService,
  private _service: MeetingService,
  private _meetingRoomService: MeetingRoomService,
  private message: NzMessageService,
   ) {
    this.validateForm = this.fb.group({
      id: [''],
      meetingTitle: ['', [Validators.required]],
      meetingContent: [''],
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      
      MeetingRoom: [''],
      MeetingRoomName: [''],
      secretary: [''],
      MeetingRoomid:[''],
 
      chairPerson: [''],
      isActive: [true, [Validators.required]] })
   }
   ngOnInit(): void {
    this.search()
   this.getAllAccount();
   this.GetmeetingRoom();
   this.updatePaginatedFileList();
  

   }
   disabledDate = (current: Date): boolean =>
    // Can not select days before today and today
    differenceInCalendarDays(current, this.today) > 0;

  disabledDateTime: DisabledTimeFn = () => ({
    nzDisabledHours: () => this.range(0, 24).splice(4, 20),
    nzDisabledMinutes: () => this.range(30, 60),
    nzDisabledSeconds: () => [55, 56]
  });
  selectRoom(value:string) :void {
    this.size = this.MeetingRoom.filter((item:any)=>item.id== this.MeetingRoomId)[0]?.size
    
    this.listOfParticipants = Array.from({ length: this.size }, (_, index) => ({
      userName: null, 
      position: index + 1,  
    }));
  }


  resetForm() {
    this.validateForm.reset()
   this.fileList = []
   this.paginatedFileList = []
  }
  openCreate() {
    this.edit = false
    this.visible = true
    this.listOfData = []
   
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
    const formData = this.validateForm.getRawValue();
  
    const Meeting= {
      id: null,
      meetingTitle: formData.meetingTitle,
      meetingContent: formData.meetingContent,
      startDate: formData.startDate ? new Date(formData.startDate) : null,
      endDate: formData.endDate ? new Date(formData.endDate) : null,
      meetingRoomId: formData.MeetingRoomid,
     
      isActive: formData.isActive,
    }
   
   
    const MeetingPeople = this.DataAccount.filter((account: ListAccount) => account.direction === 'right').map((account: ListAccount) => ({
      Id:null,
        HeaderID:'',
        UserName: account.userName,
        Seat: this.listOfParticipants.find((participant) => participant.userName === account.userName)?.position || null,
        Fullname: account.fullName ,
        Device:'',
        RoleMeeting: account.userName=== formData.chairPerson ? 'C' : (account.userName === formData.secretary ? 'S' : ''),

    }))


    if (this.validateForm.valid) {
      const formDataToSend = new FormData();

      formDataToSend.append('Meeting', JSON.stringify(Meeting)); 
      formDataToSend.append('MeetingPeople', JSON.stringify(MeetingPeople));
      this.fileList.forEach((file) => {
        formDataToSend.append('FileData', file); 
      });


    
      if (this.edit) {
        const formDataToSendupdate = new FormData();
       var id= formData.id
       const Meetingupdate= {
        id: formData.id,
        meetingTitle: formData.meetingTitle,
        meetingContent: formData.meetingContent,
        startDate: formData.startDate ? new Date(formData.startDate) : null,
        endDate: formData.endDate ? new Date(formData.endDate) : null,
        meetingRoomId: formData.MeetingRoomid,
       
        isActive: formData.isActive,
      }
     
    
      const MeetingPeopleupdate = this.DataAccount.filter((account: ListAccount) => account.direction === 'right').map((account: ListAccount) => ({
          Id:this.dataPaticipants.filter((item:any)=>item.userName === account.userName)[0]?.id,
          HeaderID:formData.id,
          UserName: account.userName,
          Seat: this.listOfParticipants.find((participant) => participant.userName === account.userName)?.position || null,
          Fullname: account.fullName ,
          Device:'',
          RoleMeeting: account.userName=== formData.chairPerson ? 'C' : (account.userName === formData.secretary ? 'S' : ''),
  
      }))

      this.listfieupdate = this.fileList.map((item: any) => ({
        name: item.name,}))
      formDataToSendupdate.append('Meeting', JSON.stringify(Meetingupdate)); 
      formDataToSendupdate.append('MeetingPeople', JSON.stringify(MeetingPeopleupdate));
      formDataToSendupdate.append('filelist', JSON.stringify(this.listfieupdate));
      this.fileList.forEach((file) => {
        formDataToSendupdate.append('FileData', file); 
      });
     
        this._service
          .update(formDataToSendupdate,

          )
          .subscribe({
            next: (data) => {
              this.search()
              this.isSubmit = false
              this.visible = false
              this.resetForm()
            },
            error: (response) => {
              console.log(response)
            },
          })
      } else {
       
        this._service
          .create(formDataToSend)
          .subscribe({
            next: (data) => {
              this.search()
              this.isSubmit = false
              this.visible = false
              this.resetForm()
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
    
    this._service.search(this.filter).subscribe({
      next: (data) => {
       
        this.paginationResult = data
      },
      error: (response) => {
        console.log(response)
      },
    })
  }
  GetmeetingRoom() {
    this._meetingRoomService.getAll().subscribe({ 
      next: (data) => {
        this.MeetingRoom = data
       
      },
      error: (response) => {
        console.log(response)
      },
    })
  }
  
  getallPeopleMeeting(id: string) {
    
    this._service.getAllPeopleMeeting(id).subscribe({
      next: (data) => {
        console.log('data', data)
        this.charPerson = data.people.filter((item:any)=>item.roleMeeting.trim() === 'C')[0]?.userName  
        this.secretary = data.people.filter((item:any)=>item.roleMeeting.trim() === 'S')[0]?.userName  
        this.validateForm.get('secretary')?.setValue(this.secretary)
        this.validateForm.get('chairPerson')?.setValue(this.charPerson)
      
        const name= data.people.map((item:any)=>item.userName)
       this.DataAccount.forEach((item:any)=>{ name.includes(item.userName) ? item.direction = 'right' : item.direction = 'left'})
        data.people.map((item:any)=> {if(item.seat!=0){this.listOfParticipants[item.seat-1].userName = item.userName }})
          this.fileList = data.file.map((item:any)=>item)
        this.paginatedFileList = data.file.map((item:any)=>item)

        this.dataPaticipants = data.people
      },
      error: (response) => {
        console.log(response)
      },
    })
  } 
  reset() {}
openEdit(item: any) {
  this.edit = true
  this.getallPeopleMeeting(item.id)

  this.visible = true
  this.validateForm.patchValue(item)
  
  this.MeetingRoomId=item.meetingRoomid
 
  this.validateForm.get('endDate')?.setValue(item.endDate)
  this.validateForm.get('startDate')?.setValue(item.startDate)
  this.validateForm.get('meetingTitle')?.setValue(item.meetingTitle)
  this.validateForm.get('isActive')?.setValue(item.isActive)
  this.validateForm.get('id')?.setValue(item.id)
  
 
  

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
       this.originalDataAccount = [...this.DataAccount];
     
      
      },
      error: (response) => {
        console.log(response)
      },
    })
  }
  closeDrawer() {
    this.close()
    this.resetForm()

  
  }

  changeTranfer(event: any): void {
  
    this.selectedPosition =  this.DataAccount.filter((account: ListAccount) => account.direction === 'right')
    
    const selectedUserNames = this.selectedPosition.map(account => account.userName);

  
  this.listOfParticipants = this.listOfParticipants.map(participant => ({
    ...participant,
    userName: participant.userName && selectedUserNames.includes(participant.userName) ? participant.userName : null
  }));
  }

  chairPersonChange(selectedChairPerson: string): void {
 
    if (selectedChairPerson) {
      this.DataAccount = this.DataAccount.map((account: ListAccount) => {
        if (account.userName === selectedChairPerson) {
          return { ...account, direction: 'right' }; 
        }
        return account;
      });
    } else {
      this.DataAccount = this.DataAccount.map((account: ListAccount) => {
        return { ...account, direction: 'left' }; 
      });
    }
    this.selectedPosition=this.DataAccount.filter((account: ListAccount) => account.direction === 'right');
  
  }
 



  deleteRow(id: string): void {
    this.listOfData = this.listOfData.filter(d => d.id !== id);
  }
  selectedFileName: string | [] = [];
  selectedFile: File | [] = [];
  
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
  
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name; // Lưu tên file để hiển thị
 
    }
  }
  
  uploadFile(): void {
    if (this.selectedFile) {
      const formData = new FormData();
  }}


onFileSelectedFile(event: Event): void {
  const input = event.target as HTMLInputElement;

  if (input.files) {
    for (let i = 0; i < input.files.length; i++) {
      this.fileList.push(input.files[i]);
    }
  }
  this.updatePaginatedFileList()
}

onPageChange(page: number): void {
  this.currentPage = page;
  this.updatePaginatedFileList();
}

updatePaginatedFileList(): void {
  const startIndex = (this.currentPage - 1) * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  this.paginatedFileList = this.fileList.slice(startIndex, endIndex);

}

removeFile(index: number): void {
  const globalIndex = (this.currentPage - 1) * this.pageSize + index;
  this.fileList.splice(globalIndex, 1);
  this.updatePaginatedFileList();
  console.log('fileList', this.fileList)
 

}
changePosition(event: any): void {

  this.selectedPosition = this.selectedPosition.filter((account: listTranfer) => account.userName !== event);
 
}

}
