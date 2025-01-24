import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateReportsListComponent } from './generate-reports-list.component';

describe('GenerateReportsListComponent', () => {
  let component: GenerateReportsListComponent;
  let fixture: ComponentFixture<GenerateReportsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateReportsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateReportsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
