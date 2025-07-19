import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddManualSaleComponent } from './add-manual-sale.component';

describe('AddManualSaleComponent', () => {
  let component: AddManualSaleComponent;
  let fixture: ComponentFixture<AddManualSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddManualSaleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddManualSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
