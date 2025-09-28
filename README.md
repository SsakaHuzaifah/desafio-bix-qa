# BIX Mini E-commerce - QA Automation

## Test Results

- **[Complete Test Report](https://tiagocupertino.github.io/desafio-bix-qa/final-test-report.html)**
- **[GitHub Actions](https://github.com/tiagocupertino/desafio-bix-qa/actions)**

### Multi-Browser Testing (Cypress Cloud)
- **[Chrome](https://cloud.cypress.io/projects/rxvowx/runs/16)**
- **[Firefox](https://cloud.cypress.io/projects/rxvowx/runs/15)**  
- **[Edge](https://cloud.cypress.io/projects/rxvowx/runs/17)**

## Test Coverage Summary

**52 automated tests** covering core e-commerce functionality:
- User authentication (login/logout flows)
- Product catalog display and interaction
- Shopping cart operations (add items, quantity selection)
- Coupon system (valid/invalid coupon handling)
- Checkout process completion
- API endpoint validation

## Quick Start

```bash
# Install dependencies
npm install

# Run all tests
npm run test:all

# Run with UI
npm run cy:open

# Specific test suites
npm run test:api
npm run test:e2e
```

## Project Structure

```
cypress/
├── e2e/
│   ├── api/                    # API endpoint testing
│   │   ├── auth.cy.js         # Login/logout API validation
│   │   ├── checkout.cy.js     # Checkout API with coupon validation
│   │   └── products.cy.js     # Product catalog API
│   └── ui/                     # User interface testing
│       ├── auth.cy.js         # Login/logout UI flows
│       ├── checkout.cy.js     # Cart and coupon application
│       ├── product-catalog.cy.js  # Product browsing and cart addition
│       └── connectivity.cy.js     # Basic connectivity checks
├── fixtures/                   # Test data (users, products, coupons)
└── support/                    # Custom commands and configuration
```

## Test Implementation

**API Tests:**
- Authentication endpoints with success/failure scenarios
- Product catalog data validation
- Checkout process with various coupon combinations
- Error handling for invalid inputs

**UI Tests:**
- Complete user flows from login to checkout
- Coupon application and discount display
- Cart functionality (add items, view totals)
- Form validation and error messaging

## Technical Setup

**Framework:** Cypress (provided in challenge requirements).  
**Reporting:** Mochawesome HTML reports with test videos.  
**CI/CD:** GitHub Actions for multi-browser testing.  
**Test Data:** Fixture-based approach for consistent test execution.  


## Automation Approach

**Test Organization:** Separated API and UI tests for clear coverage areas.  
**Custom Commands:** Created reusable login and cart operations.  
**Data Management:** Used fixtures for users, products, and coupon test data.  