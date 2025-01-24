import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZipperTableComponent } from './zipper-table.component';

describe('TableComponent', () => {
  let component: ZipperTableComponent;
  let fixture: ComponentFixture<ZipperTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZipperTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZipperTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
