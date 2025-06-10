import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AIAnalysisComponent } from './ai-analysis.component';

describe('AIAnalysisComponent', () => {
  let component: AIAnalysisComponent;
  let fixture: ComponentFixture<AIAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AIAnalysisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AIAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
