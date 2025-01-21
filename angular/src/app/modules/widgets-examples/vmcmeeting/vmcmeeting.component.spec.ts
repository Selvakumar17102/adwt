import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VmcmeetingComponent } from './vmcmeeting.component';

describe('VmcmeetingComponent', () => {
  let component: VmcmeetingComponent;
  let fixture: ComponentFixture<VmcmeetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VmcmeetingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VmcmeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
