import config from './jest.config.mjs';

export default {
  ...config,
  rootDir: 'test',
  testRegex: '.e2e-spec.ts$',
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/../src/$1',
  },
};
