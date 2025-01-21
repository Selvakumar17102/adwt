import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MistakeOfFactComponent } from './mistake-of-fact.component';

describe('MistakeOfFactComponent', () => {
  let component: MistakeOfFactComponent;
  let fixture: ComponentFixture<MistakeOfFactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MistakeOfFactComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MistakeOfFactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
