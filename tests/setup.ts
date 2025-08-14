// Jest setup file for test configuration
import '@testing-library/jest-dom';

// Mock environment variables
process.env.NODE_ENV = 'test';

// Global test utilities
global.beforeEach(() => {
  jest.clearAllMocks();
});

// Suppress console errors during tests unless explicitly needed
const originalError = console.error;
global.beforeAll(() => {
  console.error = jest.fn();
});

global.afterAll(() => {
  console.error = originalError;
});