const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: 'rxvowx',
  e2e: {
    baseUrl: 'http://localhost:3001',
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    video: true,
    screenshotOnRunFailure: true,
    reporter: 'cypress-mochawesome-reporter',
    reporterOptions: {
      charts: true,
      reportPageTitle: 'BIX E-commerce Test Report',
      embeddedScreenshots: true,
      inlineAssets: true,
      saveAllAttempts: false
    },
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on)
      return config
    },
  },
})