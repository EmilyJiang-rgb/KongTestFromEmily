const { defineConfig } = require("cypress")

module.exports = defineConfig({
  reporter: "mochawesome",
  reporterOptions: {
    reportDir: "reports/mochawesome-report",
    overwrite: true,
    html: true,
    json: true
  },
  e2e: {
    setupNodeEvents(on, config) {
      const envName = config.env.name || "local"
      const environments = {
        local: {
          baseUrl: "http://localhost:8002",
          api: "http://localhost:8001"
        },
        dev: {
          baseUrl: "https://dev.Kong.com",
          api: "https://dev.Kong.com:8001"
        },
        staging: {
          baseUrl: "https://staging.Kong.com",
          api: "https://staging.Kong.com:8001"
        },
        prod: {
          baseUrl: "https://prod.Kong.com",
          api: "https://prod.Kong.com:8001"
        }
      }

      config.baseUrl = environments[envName].baseUrl
      config.env.api = environments[envName].api
      return config
    }
  }
})