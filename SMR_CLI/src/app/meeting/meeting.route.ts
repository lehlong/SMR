import { Routes } from "@angular/router";
import { MeetingComponent } from "./meeting.component";

export const meetingRoutes: Routes = [
  { path: ':id', component: MeetingComponent },
]
