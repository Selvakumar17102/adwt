import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalReliefReportComponent } from './additional-relief-report.component';

describe('AdditionalReliefReportComponent', () => {
  let component: AdditionalReliefReportComponent;
  let fixture: ComponentFixture<AdditionalReliefReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdditionalReliefReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdditionalReliefReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
