import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorpsListComponent } from './corps-list.component';

describe('CorpsListComponent', () => {
  let component: CorpsListComponent;
  let fixture: ComponentFixture<CorpsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CorpsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CorpsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
