import config from './jest.config.mjs';

export default {
  ...config,
  testRegex: '.integration-spec.ts$',
};
