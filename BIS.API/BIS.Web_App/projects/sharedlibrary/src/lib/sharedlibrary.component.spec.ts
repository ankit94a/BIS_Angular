import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedlibraryComponent } from './sharedlibrary.component';

describe('SharedlibraryComponent', () => {
  let component: SharedlibraryComponent;
  let fixture: ComponentFixture<SharedlibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedlibraryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedlibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
