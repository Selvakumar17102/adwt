import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlteredCaseComponent } from './altered-case.component';

describe('AlteredCaseComponent', () => {
  let component: AlteredCaseComponent;
  let fixture: ComponentFixture<AlteredCaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlteredCaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlteredCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
