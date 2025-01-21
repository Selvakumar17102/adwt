import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalReliefListComponent } from './additional-relief-list.component';

describe('AdditionalReliefListComponent', () => {
  let component: AdditionalReliefListComponent;
  let fixture: ComponentFixture<AdditionalReliefListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdditionalReliefListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdditionalReliefListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
