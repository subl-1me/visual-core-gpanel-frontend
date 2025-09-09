import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShirtVisualizationComponent } from './shirt-visualization.component';

describe('ShirtVisualizationComponent', () => {
  let component: ShirtVisualizationComponent;
  let fixture: ComponentFixture<ShirtVisualizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShirtVisualizationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShirtVisualizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
