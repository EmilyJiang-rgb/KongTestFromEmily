Cypress Kong Create Service Testing Project
🚀 Setup & Run

Clone and install:

git clone <your-repo-url>
cd <your-project-folder>
yarn install cypress


Open Cypress GUI:

yarn cypress open

📂 Structure
cypress/
  ├── e2e/          # Test cases
  ├── fixtures/     # Test data (e.g. baseUrl)
  ├── support/      # Selectors, utils, commands

⚙️ Design Notes

Base URL from fixtures/testData.json (via visitWithBaseUrl).

Unique test data with generateNames() + timestamp.

Selectors centralized in support/selectors.js for maintainability.

UI-driven flows (service, route, certificate, delete, disable).

📌 Assumptions

Kong Gateway is running and reachable at http://localhost:8002/default/services.

data-testid attributes are stable for element selection.

Tests run sequentially (no parallel execution assumed).

⚖️ Trade-offs

Mixed hardcoded + fixture data (simplicity vs flexibility).

Combined test flows (faster coverage, less isolation).

UI tests only (slower but closer to real user behavior) if have time need to check the interface testing.


Use the command to check the report:   yarn cypress run "cypress/e2e/CreateRoute.cy.js"

Teardown:
Navigate to the directory where the docker-compose.yml file is located
- Run docker-compose down to shut down Docker services 