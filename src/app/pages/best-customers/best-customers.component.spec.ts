import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BestCustomersComponent } from './best-customers.component';

describe('BestCustomersComponent', () => {
  let component: BestCustomersComponent;
  let fixture: ComponentFixture<BestCustomersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BestCustomersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BestCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
