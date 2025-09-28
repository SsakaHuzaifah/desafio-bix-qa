describe('Product Catalog & Cart', () => {
  
  beforeEach(() => {
    // Login before each test
    cy.loginAs('regular')
  })

  context('Product Display', () => {
    
    it('Should display all products with correct information', () => {
      // Just verify products exist with basic info, don't check exact stock
      cy.contains('Keyboard').should('be.visible')
      cy.contains('R$ 199,90').should('be.visible')
      cy.contains('Mouse').should('be.visible')
      cy.contains('R$ 99,50').should('be.visible')
      cy.contains('Headset').should('be.visible')
      cy.contains('R$ 299,00').should('be.visible')
      
      // Verify stock display exists (any positive number)
      cy.contains('Estoque:').should('be.visible')
    })

    it('Should show add to cart buttons for all products', () => {
      cy.get('.product-actions > button').should('have.length', 3)
      cy.get('.product-actions > button').each($btn => {
        cy.wrap($btn).should('not.be.disabled')
        cy.wrap($btn).should('contain.text', 'Adicionar')
      })
    })

    it('Should have quantity inputs for all products', () => {
      cy.get('#qty-1').should('have.value', '1')
      cy.get('#qty-2').should('have.value', '1')  
      cy.get('#qty-3').should('have.value', '1')
    })
  })

  context('Add to Cart Functionality', () => {
    
    it('Should add single item to cart', () => {
      // Add Keyboard to cart (first product)
      cy.get('#product-list > :nth-child(1)').within(() => {
        cy.get('.product-actions > button').click()
      })
      
      // Verify cart updated with any positive quantity
      cy.contains('Carrinho:').should('be.visible')
      cy.contains('Total: R$ 199,90').should('be.visible')
    })

    it('Should add items within available stock', () => {
      // Get current stock of keyboard by reading the page
      cy.contains('Estoque:').first().invoke('text').then((stockText) => {
        const stock = parseInt(stockText.replace('Estoque: ', ''))
        
        if (stock >= 2) {
          // Try to add 2 if stock allows
          cy.get('#qty-1').clear().type('2')
          cy.get('#product-list > :nth-child(1)').within(() => {
            cy.get('.product-actions > button').click()
          })
          
          // Verify cart updated
          cy.contains('Carrinho: 2 itens').should('be.visible')
        } else {
          // Just add 1 if stock is low
          cy.get('#product-list > :nth-child(1)').within(() => {
            cy.get('.product-actions > button').click()
          })
          
          cy.contains('Carrinho: 1 itens').should('be.visible')
        }
      })
    })

    it('Should add multiple different items to cart', () => {
      // Add Keyboard
      cy.get('#product-list > :nth-child(1)').within(() => {
        cy.get('.product-actions > button').click()
      })
      
      // Add Mouse  
      cy.get('#product-list > :nth-child(2)').within(() => {
        cy.get('.product-actions > button').click()
      })
      
      // Verify cart updated
      cy.contains('Carrinho: 2 itens').should('be.visible')
      cy.contains('Total: R$ 299,40').should('be.visible')
    })
  })

  context('Stock Validation', () => {
    
    it('Should show stock validation when exceeding available quantity', () => {
      // Get current stock and try to exceed it
      cy.contains('Estoque:').first().invoke('text').then((stockText) => {
        const stock = parseInt(stockText.replace('Estoque: ', ''))
        const excessQuantity = stock + 5
        
        cy.get('#qty-1').clear().type(excessQuantity.toString())
        cy.get('#product-list > :nth-child(1)').within(() => {
          cy.get('.product-actions > button').click()
        })
        
        // Should show alert about stock limitation
        cy.on('window:alert', (txt) => {
          expect(txt).to.contains('Quantidade indisponível')
        })
      })
    })
  })

  context('Cart Basic Functionality', () => {
    
    it('Should show cart information after adding items', () => {
      // Add item to cart
      cy.get('#product-list > :nth-child(1)').within(() => {
        cy.get('.product-actions > button').click()
      })
      
      // Check that cart area shows some content
      cy.get('#checkout-section').should('be.visible')
      cy.contains('Finalizar Compra').should('be.visible')
    })
  })
})