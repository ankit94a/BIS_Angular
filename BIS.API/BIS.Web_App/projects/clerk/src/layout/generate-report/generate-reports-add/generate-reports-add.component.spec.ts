import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateReportsAddComponent } from './generate-reports-add.component';

describe('GenerateReportsAddComponent', () => {
  let component: GenerateReportsAddComponent;
  let fixture: ComponentFixture<GenerateReportsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateReportsAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateReportsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
