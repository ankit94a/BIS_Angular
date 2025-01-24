import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartAnalysisComponent } from './smart-analysis.component';

describe('SmartAnalysisComponent', () => {
  let component: SmartAnalysisComponent;
  let fixture: ComponentFixture<SmartAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmartAnalysisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmartAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
