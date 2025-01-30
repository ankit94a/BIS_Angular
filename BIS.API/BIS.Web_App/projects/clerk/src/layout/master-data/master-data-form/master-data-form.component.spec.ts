import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterDataFormComponent } from './master-data-form.component';

describe('MasterDataFormComponent', () => {
  let component: MasterDataFormComponent;
  let fixture: ComponentFixture<MasterDataFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasterDataFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterDataFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
