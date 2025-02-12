import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CdrInferenceComponent } from './cdr-inference.component';

describe('CdrInferenceComponent', () => {
  let component: CdrInferenceComponent;
  let fixture: ComponentFixture<CdrInferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CdrInferenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CdrInferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
