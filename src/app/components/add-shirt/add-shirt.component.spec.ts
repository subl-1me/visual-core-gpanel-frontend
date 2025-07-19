import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddShirtComponent } from './add-shirt.component';

describe('AddShirtComponent', () => {
  let component: AddShirtComponent;
  let fixture: ComponentFixture<AddShirtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddShirtComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddShirtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
