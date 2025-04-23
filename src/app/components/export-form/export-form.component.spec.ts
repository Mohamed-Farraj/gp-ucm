import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportFormComponent } from './export-form.component';

describe('ExportFormComponent', () => {
  let component: ExportFormComponent;
  let fixture: ComponentFixture<ExportFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
