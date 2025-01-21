import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalReliefComponent } from './additional-relief.component';

describe('AdditionalReliefComponent', () => {
  let component: AdditionalReliefComponent;
  let fixture: ComponentFixture<AdditionalReliefComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdditionalReliefComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdditionalReliefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
