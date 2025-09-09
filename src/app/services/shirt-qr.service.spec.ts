import { TestBed } from '@angular/core/testing';

import { ShirtQrService } from './shirt-qr.service';

describe('ShirtQrService', () => {
  let service: ShirtQrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShirtQrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
