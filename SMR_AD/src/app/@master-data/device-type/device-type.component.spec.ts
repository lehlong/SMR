import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceTypeComponent } from './device-type.component';

describe('DeviceTypeComponent', () => {
  let component: DeviceTypeComponent;
  let fixture: ComponentFixture<DeviceTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
