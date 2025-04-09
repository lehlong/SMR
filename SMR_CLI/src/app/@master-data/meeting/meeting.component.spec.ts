import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMettingComponent } from './meeting.component';

describe('CreateMettingComponent', () => {
  let component: CreateMettingComponent;
  let fixture: ComponentFixture<CreateMettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateMettingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateMettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
