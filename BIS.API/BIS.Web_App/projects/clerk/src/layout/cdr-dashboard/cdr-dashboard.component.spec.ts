import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CdrDashboardComponent } from './cdr-dashboard.component';

describe('CdrDashboardComponent', () => {
  let component: CdrDashboardComponent;
  let fixture: ComponentFixture<CdrDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CdrDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CdrDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
