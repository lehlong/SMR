import { Routes } from '@angular/router'
import { AccountTypeComponent } from './account-type/account-type.component'
import { CreateMettingComponent } from './meeting/meeting.component'

export const masterDataRoutes: Routes = [
  { path: 'account-type', component: AccountTypeComponent },
  {path: 'meeting', component: CreateMettingComponent },
]
