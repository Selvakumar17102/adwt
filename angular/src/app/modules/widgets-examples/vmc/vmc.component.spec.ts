import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VmcComponent } from './vmc.component';

describe('VmcComponent', () => {
  let component: VmcComponent;
  let fixture: ComponentFixture<VmcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VmcComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VmcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
