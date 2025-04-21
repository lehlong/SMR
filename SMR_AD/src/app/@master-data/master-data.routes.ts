import { Routes } from '@angular/router'

import { AccountTypeComponent } from './account-type/account-type.component'
import { MettingComponent } from './meeting/meeting.component'
import { DeviceComponent } from './device/device.component'
import { MeetingRoomComponent } from './Meeting-room/Meeting-room.component'
export const masterDataRoutes: Routes = [
  { path: 'account-type', component: AccountTypeComponent },
  { path: 'meeting', component: MettingComponent },
  {path: 'device', component: DeviceComponent},
  { path: 'meeting-room', component: MeetingRoomComponent },
]
