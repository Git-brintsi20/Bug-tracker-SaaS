// Test setup file
beforeAll(() => {
  // Mock environment variables
  process.env.JWT_SECRET = 'test-jwt-secret';
  process.env.REDIS_URL = 'redis://localhost:6379';
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/bugtracker_test';
});

afterAll(() => {
  // Cleanup
});
