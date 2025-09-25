import ServicePage from "../pages/ServicePage"

Cypress.Commands.add("createService", (name, url) => {
  ServicePage.openForm()
  ServicePage.fillForm(name, url)
  ServicePage.save()
  ServicePage.verifyCreated(name)
})

Cypress.Commands.add("viewAdvancedFields", (Connectiontimeout) => {
  cy.contains('View advanced fields').click()
  cy.contains('Connection timeout').should("exist")
  cy.get('input[name="connTimeout"]').clear().type(Connectiontimeout)
})


Cypress.Commands.add("generalInformation", (timeout) => {
  cy.contains('View advanced fields').click()
  cy.contains('Connection timeout').should("exist")
  cy.get('input[name="name"]').clear().type(timeout)
})


Cypress.Commands.add("addTags", (tags) => {
  cy.contains('Add tags').click()
  cy.contains('Tags').should("exist")
  cy.get('input[name="tags"]').clear().type(tags)
})

Cypress.Commands.add("createRoute", (serviceName, path) => {
  cy.contains(serviceName).click()
  cy.contains("New Route").click()
  cy.get('input[name="paths"]').clear().type(path)
  cy.contains("Save").click()
  cy.contains(path).should("exist")
})