import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedReportViewComponent } from './approved-report-view.component';

describe('ApprovedReportViewComponent', () => {
  let component: ApprovedReportViewComponent;
  let fixture: ComponentFixture<ApprovedReportViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovedReportViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedReportViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
