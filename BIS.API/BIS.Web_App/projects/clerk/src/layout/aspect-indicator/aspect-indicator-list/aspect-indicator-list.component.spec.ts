import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AspectIndicatorListComponent } from './aspect-indicator-list.component';

describe('AspectIndicatorListComponent', () => {
  let component: AspectIndicatorListComponent;
  let fixture: ComponentFixture<AspectIndicatorListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AspectIndicatorListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AspectIndicatorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
