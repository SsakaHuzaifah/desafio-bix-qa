describe('Checkout & Coupon System', () => {
  
  beforeEach(() => {
    // Login and add items to cart before each test
    cy.loginAs('regular')
    
    // Add some items to cart for testing
    cy.get('#product-list > :nth-child(1)').within(() => {
      cy.get('.product-actions > button').click()
    })
    
    // Verify cart has items
    cy.contains('Carrinho: 1 itens').should('be.visible')
  })

  context('Coupon Application', () => {
    
    it('Should apply valid percentage coupon (WELCOME10)', () => {
      cy.fixture('coupons').then((coupons) => {
        const coupon = coupons.valid[0] // WELCOME10 - 10%
        
        // Apply coupon
        cy.get('input[placeholder="Código do cupom"]').type(coupon.code)
        cy.contains('Aplicar Cupom').click()
        
        // Verify discount applied
        cy.contains('Subtotal: R$ 199,90').should('be.visible')
        cy.contains('Desconto: R$ 19,99').should('be.visible')
        cy.contains('Total: R$ 179,91').should('be.visible')
      })
    })

    it('Should apply valid percentage coupon (SAVE20)', () => {
      cy.fixture('coupons').then((coupons) => {
        const coupon = coupons.valid[1] // SAVE20 - 20%
        
        cy.get('input[placeholder="Código do cupom"]').type(coupon.code)
        cy.contains('Aplicar Cupom').click()
        
        // Verify 20% discount
        cy.contains('Subtotal: R$ 199,90').should('be.visible')
        cy.contains('Desconto: R$ 39,98').should('be.visible')
        cy.contains('Total: R$ 159,92').should('be.visible')
      })
    })

    it('Should apply valid fixed amount coupon (FIXED50)', () => {
      cy.fixture('coupons').then((coupons) => {
        const coupon = coupons.valid[2] // FIXED50 - R$ 50 off
        
        cy.get('input[placeholder="Código do cupom"]').type(coupon.code)
        cy.contains('Aplicar Cupom').click()
        
        // Verify fixed discount
        cy.contains('Subtotal: R$ 199,90').should('be.visible')
        cy.contains('Desconto: R$ 50,00').should('be.visible')
        cy.contains('Total: R$ 149,90').should('be.visible')
      })
    })

    it('Should reject expired coupon (EXPIRED)', () => {
      cy.fixture('coupons').then((coupons) => {
        const coupon = coupons.invalid[0] // EXPIRED
        
        cy.get('input[placeholder="Código do cupom"]').type(coupon.code)
        cy.contains('Aplicar Cupom').click()
        
        // Should show error or no discount applied
        cy.contains('Subtotal: R$ 199,90').should('be.visible')
        cy.contains('Total: R$ 199,90').should('be.visible') // No discount
      })
    })

    it('Should reject invalid coupon code', () => {
      cy.get('input[placeholder="Código do cupom"]').type('INVALID123')
      cy.contains('Aplicar Cupom').click()
      
      // Should show no discount
      cy.contains('Subtotal: R$ 199,90').should('be.visible')
      cy.contains('Total: R$ 199,90').should('be.visible')
    })
  })

  context('Checkout Process', () => {
    
    it('Should complete checkout with valid coupon', () => {
      // Apply coupon first
      cy.get('input[placeholder="Código do cupom"]').type('WELCOME10')
      cy.contains('Aplicar Cupom').click()
      
      // Complete checkout using correct selector
      cy.get('#checkout-btn').click()
      
      // Verify order completion - wait for result to appear
      cy.get('pre', { timeout: 10000 }).should('be.visible')
      cy.get('pre').should('contain', '"orderId"')
      cy.get('pre').should('contain', '"subtotal": 199.9')
      cy.get('pre').should('contain', '"discount"')
      cy.get('pre').should('contain', '"total"')
      cy.get('pre').should('contain', '"appliedCoupon"')
      cy.get('pre').should('contain', '"code": "WELCOME10"')
    })

    it('Should complete checkout without coupon', () => {
      // Complete checkout directly using correct selector
      cy.get('#checkout-btn').click()
      
      // Verify order completion
      cy.get('pre', { timeout: 10000 }).should('be.visible')
      cy.get('pre').should('contain', '"orderId"')
      cy.get('pre').should('contain', '"subtotal": 199.9')
      cy.get('pre').should('contain', '"total": 199.9')
    })

    it('Should show checkout result but maintain cart', () => {
      // Complete checkout
      cy.get('#checkout-btn').click()
      
      // Verify order completed
      cy.get('pre', { timeout: 10000 }).should('be.visible')
      
      // Cart should be cleared after successful checkout
      cy.contains('Carrinho: 0 itens – Total: R$ 0,00').should('be.visible')
    })
  })

  context('Complex Scenarios', () => {
    
    it('Should handle multiple items with coupon', () => {
      // Add another item
      cy.get('#product-list > :nth-child(2)').within(() => {
        cy.get('.product-actions > button').click()
      })
      
      // Verify cart total (199.90 + 99.50 = 299.40)
      cy.contains('Carrinho: 2 itens – Total: R$ 299,40').should('be.visible')
      
      // Apply 10% coupon
      cy.get('input[placeholder="Código do cupom"]').type('WELCOME10')
      cy.contains('Aplicar Cupom').click()
      
      // Verify calculations
      cy.contains('Subtotal: R$ 299,40').should('be.visible')
      cy.contains('Total: R$ 269,46').should('be.visible') // 10% off
      
      // Complete checkout
      cy.get('#checkout-btn').click()
      cy.get('pre', { timeout: 10000 }).should('contain', '"subtotal": 299.4')
    })

    it('Should recalculate when coupon is changed', () => {
      // Apply first coupon
      cy.get('input[placeholder="Código do cupom"]').clear().type('WELCOME10')
      cy.contains('Aplicar Cupom').click()
      cy.contains('Total: R$ 179,91').should('be.visible')
      
      // Change to different coupon
      cy.get('input[placeholder="Código do cupom"]').clear().type('SAVE20')
      cy.contains('Aplicar Cupom').click()
      cy.contains('Total: R$ 159,92').should('be.visible')
    })
  })
})