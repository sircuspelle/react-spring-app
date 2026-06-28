const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.js',
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:8080',
    browserName: 'firefox',
    headless: true,
  },
});