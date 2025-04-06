import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BestItemsComponent } from './best-items.component';

describe('BestItemsComponent', () => {
  let component: BestItemsComponent;
  let fixture: ComponentFixture<BestItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BestItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BestItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
