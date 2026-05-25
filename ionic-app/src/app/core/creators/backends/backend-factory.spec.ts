import { BackendFactory } from './backend-factory';

describe('BackendFactory', () => {
  it('should create an instance', () => {
    expect(new BackendFactory()).toBeTruthy();
  });
});
