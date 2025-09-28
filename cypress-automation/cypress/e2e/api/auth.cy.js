describe('Authentication API', () => {
  
  it('Should login successfully via API with valid credentials', () => {
    cy.fixture('users').then((users) => {
      const user = users.regular
      
      cy.request({
        method: 'POST',
        url: '/api/login',
        body: {
          email: user.email,
          password: user.password
        }
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('token')
        // Store token for future use
        window.localStorage.setItem('authToken', response.body.token)
      })
    })
  })

  it('Should fail login via API with invalid credentials', () => {
    cy.request({
      method: 'POST',
      url: '/api/login',
      body: {
        email: 'invalid@test.com',
        password: 'wrongpass'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401)
    })
  })

  it('Should get user info when authenticated', () => {
    // First login
    cy.fixture('users').then((users) => {
      const user = users.regular
      
      cy.request('POST', '/api/login', {
        email: user.email,
        password: user.password
      }).then((loginResponse) => {
        // Then get user info
        cy.request({
          method: 'GET',
          url: '/api/me',
          headers: {
            'Authorization': `Bearer ${loginResponse.body.token}`
          }
        }).then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body).to.have.property('user')
          expect(response.body.user).to.have.property('email', user.email)
        })
      })
    })
  })

  it('Should logout successfully via API', () => {
    // Login first
    cy.fixture('users').then((users) => {
      const user = users.regular
      
      cy.request('POST', '/api/login', {
        email: user.email,
        password: user.password
      }).then(() => {
        // Then logout
        cy.request('POST', '/api/logout').then((response) => {
          expect(response.status).to.eq(200)
          
          // Verify we're logged out by trying to access /api/me
          cy.request({
            method: 'GET',
            url: '/api/me',
            failOnStatusCode: false
          }).then((meResponse) => {
            expect(meResponse.status).to.eq(401) // Should be unauthorized
          })
        })
      })
    })
  })
})