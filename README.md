# BIX Mini E-commerce - QA Automation Solution

Comprehensive test automation implementation covering all application functionality through API and UI testing strategies.

## Test Coverage Summary

**51 automated tests** providing complete coverage of:
- Authentication flows and session management
- Product catalog and inventory operations  
- Shopping cart functionality with stock validation
- Coupon system validation and discount calculations
- Checkout process with all edge cases
- API endpoint functionality and error handling

## Quick Start

```bash
# Install dependencies
npm install

# Run all tests
npm run test

# Run with UI
npm run cypress:open

# Specific test suites
npx cypress run --spec "cypress/e2e/api/*.cy.js"
npx cypress run --spec "cypress/e2e/ui/*.cy.js"
```

## Test Architecture

### Project Structure
```
cypress/
├── e2e/
│   ├── api/                    # API endpoint testing
│   │   ├── auth.cy.js         # Login, logout, /api/me validation
│   │   ├── checkout.cy.js     # Checkout process + coupon validation
│   │   └── products.cy.js     # Product catalog API testing
│   └── ui/                     # User interface testing
│       ├── auth.cy.js         # Authentication UI flows
│       ├── checkout.cy.js     # Cart and checkout interface
│       ├── product-catalog.cy.js  # Product browsing and interaction
│       └── connectivity.cy.js     # Health checks and smoke tests
├── fixtures/                   # Test data (users, products, coupons)
└── support/                    # Custom commands and configuration
```

### Test Strategy

**API Testing:**
- All documented endpoints with response validation
- Authentication state management and token handling
- Error scenarios (401, 400, 404) with proper assertions
- Business logic validation (stock updates, discount calculations)

**UI Testing:**
- Complete user journeys from login to checkout
- Stock validation and cart state management  
- Coupon application with real-time discount updates
- Cross-browser compatibility (Chrome, Firefox, Edge)
- Protected route access control

## Key Test Scenarios

**Critical Business Flows:**
1. **Complete Purchase:** Login → Browse → Add to Cart → Apply Coupon → Checkout
2. **Stock Management:** Verify stock decrements and out-of-stock handling
3. **Guest Checkout Blocking:** Confirm authentication requirement
4. **Coupon Validation:** All coupon types with proper discount calculations

**Edge Cases Covered:**
- Invalid authentication attempts
- Expired and non-existent coupons
- Quantity validation and stock limits
- Cart persistence across sessions
- API error handling and malformed requests

## Quality Assurance Approach

**Test Design Principles:**
- Boundary testing for stock and quantity limits
- Negative testing for all user inputs and API calls
- State validation for cart and authentication persistence
- Business logic verification for calculations and workflows

**Data Validation:**
- Response structure and type checking
- Stock quantity accuracy before/after operations
- Discount calculation verification
- Order total computations with multiple items and coupons

## Technical Implementation

**Framework Rationale:** Cypress chosen for its robust API testing capabilities, excellent debugging tools, and reliable UI automation.

**Test Data Management:** Fixture-based approach ensures consistent, isolated test execution across environments.

**Custom Commands:** Reusable functions for authentication, cart operations, and common workflows to maintain DRY principles.

## CI/CD Integration

**Automated Pipeline:** GitHub Actions executes full test suite on every commit to main branch.

**Reporting:** 
- Cypress Cloud integration for historical test tracking
- Detailed HTML reports with failure screenshots
- Test execution videos for debugging

## Results & Coverage

**API Coverage:** 100% of documented endpoints with comprehensive validation
**UI Coverage:** All user-facing functionality with cross-browser testing
**Error Scenarios:** Complete negative testing suite for robust quality assurance

Test suite validates both happy path scenarios and edge cases, ensuring application reliability and user experience quality.