import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReliefListComponent } from './relief-list.component';

describe('ReliefListComponent', () => {
  let component: ReliefListComponent;
  let fixture: ComponentFixture<ReliefListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReliefListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReliefListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
