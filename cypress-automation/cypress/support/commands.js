// Authentication commands
Cypress.Commands.add('loginAs', (userType) => {
  cy.fixture('users').then((users) => {
    const user = users[userType]
    cy.visit('/')
    cy.get('#email').clear().type(user.email)
    cy.get('#password').clear().type(user.password)
    cy.get('#login-btn').click()
    
    if (userType !== 'invalid') {
      cy.get('#logout-btn').should('exist')
    }
  })
})