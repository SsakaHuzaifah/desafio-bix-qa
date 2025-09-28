describe('Checkout API', () => {
  
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

  describe('Coupon Validation', () => {
    it('Should validate valid coupon WELCOME10', () => {
      cy.request({
        method: 'POST',
        url: '/api/validate-coupon',
        body: {
          code: 'WELCOME10'
        }
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('valid').to.be.true
        expect(response.body).to.have.property('coupon')
        expect(response.body.coupon).to.have.property('code', 'WELCOME10')
        expect(response.body.coupon).to.have.property('discount', 10)
        expect(response.body.coupon).to.have.property('type', 'percentage')
      })
    })

    it('Should validate valid coupon FIXED50', () => {
      cy.request({
        method: 'POST',
        url: '/api/validate-coupon',
        body: {
          code: 'FIXED50'
        }
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('valid').to.be.true
        expect(response.body).to.have.property('coupon')
        expect(response.body.coupon).to.have.property('code', 'FIXED50')
        expect(response.body.coupon).to.have.property('discount')
        expect(response.body.coupon).to.have.property('type')
      })
    })

    it('Should reject invalid coupon', () => {
      cy.request({
        method: 'POST',
        url: '/api/validate-coupon',
        body: {
          code: 'INVALID_COUPON'
        }
      }).then((response) => {
        expect(response.status).to.eq(200) // API returns 200 even for invalid
        expect(response.body).to.have.property('valid').to.be.false
        expect(response.body).to.have.property('message', 'Invalid coupon code')
      })
    })

    it('Should reject expired coupon', () => {
      cy.request({
        method: 'POST',
        url: '/api/validate-coupon',
        body: {
          code: 'EXPIRED10'
        }
      }).then((response) => {
        expect(response.status).to.eq(200) // API returns 200 even for invalid
        expect(response.body).to.have.property('valid').to.be.false
        expect(response.body).to.have.property('message', 'Invalid coupon code')
      })
    })
  })

  describe('Checkout Process', () => {
    it('Should complete checkout with single item (Mouse)', () => {
      const orderData = {
        items: [
          { id: 2, qty: 1 } // Mouse has stock 21
        ]
      }

      cy.request({
        method: 'POST',
        url: '/api/checkout',
        body: orderData
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('orderId')
        expect(response.body).to.have.property('subtotal')
        expect(response.body).to.have.property('total')
        expect(response.body.orderId).to.be.a('string')
        expect(response.body.subtotal).to.be.a('number')
        expect(response.body.total).to.be.a('number')
        expect(response.body.subtotal).to.eq(99.5) // Mouse price
      })
    })

    it('Should complete checkout with coupon WELCOME10', () => {
      const orderData = {
        items: [
          { id: 2, qty: 1 } // Mouse
        ],
        couponCode: 'WELCOME10'
      }

      cy.request({
        method: 'POST',
        url: '/api/checkout',
        body: orderData
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('orderId')
        expect(response.body).to.have.property('subtotal')
        expect(response.body).to.have.property('discount')
        expect(response.body).to.have.property('total')
        expect(response.body).to.have.property('appliedCoupon')
        expect(response.body.appliedCoupon.code).to.eq('WELCOME10')
        expect(response.body.discount).to.be.greaterThan(0)
        expect(response.body.total).to.be.lessThan(response.body.subtotal)
        expect(response.body.subtotal).to.eq(99.5) // Mouse price
      })
    })

    it('Should complete checkout with coupon FIXED50', () => {
      const orderData = {
        items: [
          { id: 2, qty: 1 } // Mouse
        ],
        couponCode: 'FIXED50'
      }

      cy.request({
        method: 'POST',
        url: '/api/checkout',
        body: orderData
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('appliedCoupon')
        expect(response.body.appliedCoupon.code).to.eq('FIXED50')
        expect(response.body.appliedCoupon.type).to.eq('fixed')
        expect(response.body.discount).to.eq(50)
        expect(response.body.subtotal).to.eq(99.5) // Mouse price
      })
    })

    it('Should complete checkout with multiple items', () => {
      const orderData = {
        items: [
          { id: 2, qty: 2 }, // 2 Mice
          { id: 3, qty: 1 }  // 1 Headset
        ]
      }

      cy.request({
        method: 'POST',
        url: '/api/checkout',
        body: orderData
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('orderId')
        expect(response.body).to.have.property('subtotal')
        expect(response.body).to.have.property('total')
        expect(response.body.subtotal).to.eq(498) // 2*99.5 + 299 = 498
      })
    })

    it('Should complete checkout with multiple items and coupon', () => {
      const orderData = {
        items: [
          { id: 2, qty: 1 }, // Mouse
          { id: 3, qty: 1 }  // Headset
        ],
        couponCode: 'WELCOME10'
      }

      cy.request({
        method: 'POST',
        url: '/api/checkout',
        body: orderData
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('appliedCoupon')
        expect(response.body.appliedCoupon.code).to.eq('WELCOME10')
        expect(response.body.discount).to.be.greaterThan(0)
        expect(response.body.subtotal).to.eq(398.5) // 99.5 + 299
      })
    })

    it('Should handle checkout with invalid coupon', () => {
      const orderData = {
        items: [
          { id: 2, qty: 1 } // Mouse
        ],
        couponCode: 'INVALID_COUPON'
      }

      cy.request({
        method: 'POST',
        url: '/api/checkout',
        body: orderData
      }).then((response) => {
        expect(response.status).to.eq(200)
        // Should complete without coupon applied
        expect(response.body).to.have.property('appliedCoupon', null)
        expect(response.body.subtotal).to.eq(99.5)
        expect(response.body.total).to.eq(99.5) // No discount
      })
    })

    it('Should validate quantity limits', () => {
      const orderData = {
        items: [
          { id: 2, qty: 0 } // Invalid quantity
        ]
      }

      cy.request({
        method: 'POST',
        url: '/api/checkout',
        body: orderData,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body).to.have.property('error')
      })
    })

    it('Should handle invalid product ID', () => {
      const orderData = {
        items: [
          { id: 999, qty: 1 } // Non-existent product
        ]
      }

      cy.request({
        method: 'POST',
        url: '/api/checkout',
        body: orderData,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 404])
        expect(response.body).to.have.property('error')
      })
    })
  })
})