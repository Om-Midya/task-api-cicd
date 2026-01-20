/**
 * Jest Configuration
 *
 * This tells Jest how to run our tests:
 * - Use ts-jest to handle TypeScript files
 * - Run in Node.js environment (not browser)
 * - Look for test files in the tests/ folder
 */

module.exports = {
  // Use ts-jest to compile TypeScript test files
  preset: 'ts-jest',

  // Run in Node.js environment (for backend testing)
  testEnvironment: 'node',

  // Where to find test files
  roots: ['<rootDir>/tests'],

  // Test file patterns (files ending in .test.ts or .spec.ts)
  testMatch: ['**/*.test.ts', '**/*.spec.ts'],

  // Collect code coverage information
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/index.ts', // Exclude entry point from coverage
  ],

  // Clear mocks between tests
  clearMocks: true,

  // Show verbose output
  verbose: true,
};
