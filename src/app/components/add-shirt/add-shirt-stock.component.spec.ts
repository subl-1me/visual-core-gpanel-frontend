import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddShirtStockComponent } from './add-shirt-stock.component';

describe('AddShirtStockComponent', () => {
  let component: AddShirtStockComponent;
  let fixture: ComponentFixture<AddShirtStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddShirtStockComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddShirtStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
