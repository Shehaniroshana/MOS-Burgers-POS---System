import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodItemManageComponent } from './food-item-manage.component';

describe('FoodItemManageComponent', () => {
  let component: FoodItemManageComponent;
  let fixture: ComponentFixture<FoodItemManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoodItemManageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FoodItemManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
