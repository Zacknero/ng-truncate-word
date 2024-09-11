import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TruncateWordComponent } from './truncate-word.component';

describe('TruncateWordComponent', () => {
  let component: TruncateWordComponent;
  let fixture: ComponentFixture<TruncateWordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TruncateWordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TruncateWordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
