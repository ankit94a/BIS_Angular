import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesForMeComponent } from './notes-for-me.component';

describe('NotesForMeComponent', () => {
  let component: NotesForMeComponent;
  let fixture: ComponentFixture<NotesForMeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotesForMeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotesForMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
