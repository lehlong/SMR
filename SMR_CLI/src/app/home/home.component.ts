import { Component } from '@angular/core';
import { ShareModule } from '../shared/share-module';
import { Router } from '@angular/router';
import { MainLayoutComponent } from '../layouts/main-layout/main-layout.component';

@Component({
  selector: 'app-home',
  imports: [ShareModule],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  constructor(private router: Router, private layout : MainLayoutComponent) {
    layout.showMainSidebar = true;
  }
  listDataMap = {

  };

  getMonthData(date: Date): number | null {
    if (date.getMonth() === 8) {
      return 1394;
    }
    return null;
  }


  onOpenMeeting(id: string) {
    this.router.navigate([`/meeting/${id}`]);
  }
}
