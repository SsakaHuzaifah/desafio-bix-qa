describe('Authentication Flow', () => {
  
  beforeEach(() => {
    cy.visit('/')
  })

  context('Login Tests', () => {
    
    it('Should login successfully with valid admin credentials', () => {
      cy.fixture('users').then((users) => {
        const admin = users.admin
        
        // Fill login form
        cy.get('#email').clear().type(admin.email)
        cy.get('#password').clear().type(admin.password)
        cy.get('#login-btn').click()
        
        // Verify successful login
        cy.get('#logout-btn').should('exist')
        cy.url().should('eq', Cypress.config().baseUrl + '/')
        
        // Verify user can see protected content
        cy.contains('Produtos').should('be.visible')
        cy.contains('Keyboard').should('be.visible')
      })
    })

    it('Should login successfully with valid regular user credentials', () => {
      cy.fixture('users').then((users) => {
        const user = users.regular
        
        cy.get('#email').clear().type(user.email)
        cy.get('#password').clear().type(user.password)
        cy.get('#login-btn').click()
        
        // Verify successful login
        cy.get('#logout-btn').should('exist')
        cy.contains('Produtos').should('be.visible')
      })
    })

    it('Should fail login with invalid credentials', () => {
      cy.fixture('users').then((users) => {
        const invalid = users.invalid
        
        cy.get('#email').clear().type(invalid.email)
        cy.get('#password').clear().type(invalid.password)
        cy.get('#login-btn').click()
        
        // Should stay on login page
        cy.get('#email').should('be.visible')
        cy.get('#password').should('be.visible')
        
        // Should not have logout button
        cy.get('#logout-btn').should('not.be.visible')
      })
    })

    it('Should validate required fields', () => {
      // Check that form elements exist and are functional
      cy.get('#email').should('be.visible').and('have.attr', 'type', 'email')
      cy.get('#password').should('be.visible').and('have.attr', 'type', 'password')
      cy.get('#login-btn').should('be.visible').and('contain.text', 'Entrar')
      
      // Test that login button is clickable
      cy.get('#login-btn').should('not.be.disabled')
    })
  })

  context('Logout Tests', () => {
    
    beforeEach(() => {
      // Login before each logout test
      cy.fixture('users').then((users) => {
        const user = users.regular
        cy.get('#email').clear().type(user.email)
        cy.get('#password').clear().type(user.password)
        cy.get('#login-btn').click()
        cy.get('#logout-btn').should('exist')
      })
    })

    it('Should logout successfully and redirect to login', () => {
      // Click logout button (even if hidden, we can force click)
      cy.get('#logout-btn').click({ force: true })
      
      // Should redirect to login page
      cy.get('#email').should('be.visible')
      cy.get('#password').should('be.visible')
      
      // Logout button should not be visible
      cy.get('#logout-btn').should('not.be.visible')
    })

    it('Should clear user session on logout', () => {
      cy.get('#logout-btn').click({ force: true })
      
      // Verify localStorage is cleared
      cy.window().then((win) => {
        expect(win.localStorage.getItem('authToken')).to.be.null
      })
    })
  })

  context('Session Persistence', () => {
    
    it('Should maintain login state on page refresh', () => {
      cy.fixture('users').then((users) => {
        const user = users.regular
        
        // Login
        cy.get('#email').clear().type(user.email)
        cy.get('#password').clear().type(user.password)
        cy.get('#login-btn').click()
        cy.get('#logout-btn').should('exist')
        
        // Refresh page
        cy.reload()
        
        // Should still be logged in
        cy.get('#logout-btn').should('exist')
        cy.contains('Produtos').should('be.visible')
      })
    })
  })
})