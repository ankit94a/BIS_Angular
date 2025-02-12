import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedReportsComponent } from './approved-reports.component';

describe('ApprovedReportsComponent', () => {
  let component: ApprovedReportsComponent;
  let fixture: ComponentFixture<ApprovedReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovedReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
