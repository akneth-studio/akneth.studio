const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(isows|@supabase|@supabase/supabase-js|@supabase/realtime-js|@supabase/gotrue-js|@supabase/postgrest-js|@supabase/supabase-auth-helpers-js)/)', // Transform these modules
  ],
};

module.exports = createJestConfig(customJestConfig);
