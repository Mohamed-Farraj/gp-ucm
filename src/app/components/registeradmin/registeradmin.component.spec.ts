import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteradminComponent } from './registeradmin.component';

describe('RegisteradminComponent', () => {
  let component: RegisteradminComponent;
  let fixture: ComponentFixture<RegisteradminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisteradminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegisteradminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
