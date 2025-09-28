describe('Products API', () => {
  
  beforeEach(() => {
    // Login to get valid session
    cy.fixture('users').then((users) => {
      const user = users.regular
      cy.request('POST', '/api/login', {
        email: user.email,
        password: user.password
      })
    })
  })

  it('Should get all products successfully', () => {
    cy.request('GET', '/api/products').then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('items')
      expect(response.body.items).to.be.an('array')
      expect(response.body.items.length).to.eq(3)
      
      // Verify product structure
      const products = response.body.items
      products.forEach(product => {
        expect(product).to.have.property('id')
        expect(product).to.have.property('name')
        expect(product).to.have.property('price')
        expect(product).to.have.property('stock')
        expect(product.id).to.be.a('number')
        expect(product.name).to.be.a('string')
        expect(product.price).to.be.a('number')
        expect(product.stock).to.be.a('number')
      })
    })
  })

  it('Should return correct product names and IDs', () => {
    cy.request('GET', '/api/products').then((response) => {
      const products = response.body.items
      
      // Verify specific products exist with correct structure
      const keyboard = products.find(p => p.name === 'Keyboard')
      const mouse = products.find(p => p.name === 'Mouse')
      const headset = products.find(p => p.name === 'Headset')
      
      expect(keyboard).to.exist
      expect(mouse).to.exist
      expect(headset).to.exist
      
      expect(keyboard.id).to.eq(1)
      expect(mouse.id).to.eq(2)
      expect(headset.id).to.eq(3)
    })
  })

  it('Should return products with valid stock levels', () => {
    cy.request('GET', '/api/products').then((response) => {
      const products = response.body.items
      
      // All products should have non-negative stock
      products.forEach(product => {
        expect(product.stock).to.be.at.least(0) // Fixed: use .at.least() instead of .greaterThanOrEqual()
        expect(product.price).to.be.greaterThan(0)
      })
    })
  })

  it('Should return products with correct actual prices', () => {
    cy.request('GET', '/api/products').then((response) => {
      const products = response.body.items
      
      const keyboard = products.find(p => p.name === 'Keyboard')
      const mouse = products.find(p => p.name === 'Mouse')
      const headset = products.find(p => p.name === 'Headset')
      
      // Verify actual price values (these should be stable)
      expect(keyboard.price).to.eq(199.9)
      expect(mouse.price).to.eq(99.5)
      expect(headset.price).to.eq(299)
    })
  })

  it('Should maintain consistent product data structure', () => {
    cy.request('GET', '/api/products').then((response) => {
      const products = response.body.items
      
      // Verify all required fields are present and have correct types
      products.forEach(product => {
        expect(Object.keys(product)).to.include.members(['id', 'name', 'price', 'stock'])
        expect(typeof product.id).to.eq('number')
        expect(typeof product.name).to.eq('string')
        expect(typeof product.price).to.eq('number')
        expect(typeof product.stock).to.eq('number')
        
        // Verify reasonable value ranges
        expect(product.id).to.be.within(1, 3)
        expect(product.name.length).to.be.greaterThan(0)
        expect(product.price).to.be.greaterThan(0)
        expect(product.stock).to.be.at.least(0) // Stock can be 0 or more
      })
    })
  })

  it('Should have at least some products with stock available', () => {
    cy.request('GET', '/api/products').then((response) => {
      const products = response.body.items
      
      // At least one product should have stock > 0
      const availableProducts = products.filter(p => p.stock > 0)
      expect(availableProducts.length).to.be.greaterThan(0)
      
      // Each available product should have expected structure
      availableProducts.forEach(product => {
        expect(product).to.have.all.keys('id', 'name', 'price', 'stock')
        expect(product.stock).to.be.greaterThan(0)
      })
    })
  })
})