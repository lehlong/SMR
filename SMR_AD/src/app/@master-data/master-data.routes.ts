import { Routes } from '@angular/router';

import { AccountTypeComponent } from './account-type/account-type.component';
import { DeviceComponent } from './device/device.component';
import { DeviceTypeComponent } from './device-type/device-type.component';
import { RoomComponent } from './room/room.component';
export const masterDataRoutes: Routes = [
  { path: 'account-type', component: AccountTypeComponent },
  { path: 'device', component: DeviceComponent },
  { path: 'meeting-room', component: RoomComponent },
  { path: 'device-type', component: DeviceTypeComponent },
];
