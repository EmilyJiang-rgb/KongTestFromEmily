describe("Service Flow (Env + Report)", () => {
  before(() => {
    cy.visit("http://localhost:8002") // baseUrl switch env
  })

  it("Create Service with full URL", () => {
    cy.fixture("service").then(service => {
      cy.createService(service.url)
      //cy.createRoute(service.name, service.route)
    })
  })






  
  after(() => {
    // Teardown: delete test data
    cy.fixture("service").then(service => {
      cy.request("DELETE", `${Cypress.env("api")}/services/${service.name}`)
    })
  })
})