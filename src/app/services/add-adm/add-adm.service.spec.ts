import { TestBed } from '@angular/core/testing';

import { AddAdmService } from './add-adm.service';

describe('AddAdmService', () => {
  let service: AddAdmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddAdmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
