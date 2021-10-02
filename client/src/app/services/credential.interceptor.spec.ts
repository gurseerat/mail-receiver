import { TestBed } from '@angular/core/testing';

import { CredentialInterceptor } from './credential.interceptor';

describe('CredentialInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      CredentialInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: CredentialInterceptor = TestBed.inject(CredentialInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
