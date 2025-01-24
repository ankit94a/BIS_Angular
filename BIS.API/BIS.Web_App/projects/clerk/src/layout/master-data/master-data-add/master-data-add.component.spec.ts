import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterDataAddComponent } from './master-data-add.component';

describe('MasterDataAddComponent', () => {
  let component: MasterDataAddComponent;
  let fixture: ComponentFixture<MasterDataAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasterDataAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterDataAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
