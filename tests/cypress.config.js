const { defineConfig } = require("cypress");

module.exports = defineConfig({
  video: true,
  screenshotsFolder: "cypress/screenshots",
  videosFolder: "cypress/videos",
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || "http://localhost:8080",
    specPattern: "cypress/e2e/**/*.cy.js",
    supportFile: false
  }
});
