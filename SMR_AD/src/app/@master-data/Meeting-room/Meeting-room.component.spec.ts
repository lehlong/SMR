import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingRoomComponent  } from './Meeting-room.component';

describe('Meeting-Room', () => {
  let component: MeetingRoomComponent;
  let fixture: ComponentFixture<MeetingRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetingRoomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeetingRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
