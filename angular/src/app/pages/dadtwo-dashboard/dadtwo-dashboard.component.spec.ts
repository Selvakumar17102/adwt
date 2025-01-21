import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DadtwoDashboardComponent } from './dadtwo-dashboard.component';

describe('DadtwoDashboardComponent', () => {
  let component: DadtwoDashboardComponent;
  let fixture: ComponentFixture<DadtwoDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DadtwoDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DadtwoDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
