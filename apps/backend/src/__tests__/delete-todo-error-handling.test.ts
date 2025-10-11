import { describe, it, expect } from 'vitest';
import { NotFoundError } from '../errors';

describe('NotFoundError', () => {
  it('should create a NotFoundError instance', () => {
    const errorMessage = 'Todo with id 123 not found';
    const error = new NotFoundError(errorMessage);
    
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(NotFoundError);
    expect(error.message).toBe(errorMessage);
    expect(error.name).toBe('NotFoundError');
  });

  it('should be caught with instanceof check', () => {
    const error = new NotFoundError('Test error');
    
    try {
      throw error;
    } catch (e) {
      expect(e instanceof NotFoundError).toBe(true);
      expect(e instanceof Error).toBe(true);
    }
  });

  it('should differentiate from generic Error', () => {
    const notFoundError = new NotFoundError('Not found');
    const genericError = new Error('Generic error');
    
    expect(notFoundError instanceof NotFoundError).toBe(true);
    expect(genericError instanceof NotFoundError).toBe(false);
  });
});
