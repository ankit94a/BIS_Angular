import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartAnalysis1Component } from './smart-analysis1.component';

describe('SmartAnalysis1Component', () => {
  let component: SmartAnalysis1Component;
  let fixture: ComponentFixture<SmartAnalysis1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmartAnalysis1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmartAnalysis1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
