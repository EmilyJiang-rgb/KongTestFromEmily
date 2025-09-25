class CreateServicePage {
  static openForm() {
    cy.get('a[href="/default/services/create"]').click()
    cy.get('input[name="url').should('be.visible')
  }

  static fillServiceName(name) {
    cy.get('input[name="serviceName"]').type(name)
  }

  static selectCategory(category) {
    cy.get('select[name="category"]').select(category)
  }

  static submit() {
    cy.get('button[type="submit"]').click()
  }

  static doOtherAction() {
    cy.get('button.do-something').click()
  }
}


export default CreateServicePage