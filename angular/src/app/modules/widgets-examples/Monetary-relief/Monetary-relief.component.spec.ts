import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonetaryReliefComponent  } from './Monetary-relief.component';

describe('MonetaryReliefComponent ', () => {
  let component: MonetaryReliefComponent ;
  let fixture: ComponentFixture<MonetaryReliefComponent >;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonetaryReliefComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonetaryReliefComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
