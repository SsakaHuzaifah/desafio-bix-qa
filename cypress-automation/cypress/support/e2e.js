import './commands'

import 'cypress-mochawesome-reporter/register'

beforeEach(() => {
  cy.clearLocalStorage()
})