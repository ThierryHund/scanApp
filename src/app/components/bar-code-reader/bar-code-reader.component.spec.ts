import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarCodeReaderComponent } from './bar-code-reader.component';

describe('BarCodeReaderComponent', () => {
  let component: BarCodeReaderComponent;
  let fixture: ComponentFixture<BarCodeReaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarCodeReaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarCodeReaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
