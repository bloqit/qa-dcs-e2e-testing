const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'https://dcs.dev.bloq.it/',
    supportFile: 'cypress/support/commands.js',
    env: {
      api_key_dcs: process.env.CYPRESS_API_KEY_DCS,
      api_key_cloud: process.env.CYPRESS_API_KEY_CLOUD,
      endpoint_cloud_url: process.env.CYPRESS_CLOUD_URL
    },
  },
});