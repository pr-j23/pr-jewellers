# Test Plan - pr-jewellers Cleanup

## Overview

This document tracks testing requirements for the cleanup changes made to the pr-jewellers application.

## ⚠️ Important Testing Limitation

**Current tests verify implementation AND behavior (UPDATED)**

After adding comprehensive behavioral tests, we now have:

### What We Have NOW (After Enhancement)

- ✅ Tests verify: `computeProductPrice` calculates prices correctly
- ✅ Tests verify: Price sorting uses computed prices, not just fixed_price
- ✅ Tests verify: `formValuesToProduct` converts strings to numbers
- ✅ Tests verify: Cleared inputs convert to zero at submission
- ✅ Tests verify: Search handles null descriptions without crashing
- ⚠️ Tests verify: WebSocket behavior (structural only, requires manual testing)

### What Still Needs Manual Verification

- ❌ WebSocket reconnection behavior (requires real WebSocket server)
- ❌ Health check button colors (requires UI interaction)
- ❌ Navigate component vs navigate() call (requires UI interaction)

### Why This Matters

The bug fixes were made to correct behavior issues:

- Price sorting was wrong (sorted by fixed_price only, not displayed price)
- Number inputs couldn't be cleared
- Health check auto-ran on mount

The tests should verify these **bugs are fixed**, not just that the new code runs without errors.

### Proper Testing Approach (Future Reference)

For behavior-preserving changes, the correct approach is:

1. **Write behavioral tests BEFORE changing code**
   - Test the current (buggy) behavior to establish baseline
   - This documents what the system currently does
   - Example: "Given products with weight-based pricing, sorting by price sorts by fixed_price only"

2. **Make the fix**
   - Change the implementation
   - Behavioral test should now fail (expected - we changed behavior)

3. **Update test to expect correct behavior**
   - Change test assertion to verify the bug is fixed
   - Example: "Given products with weight-based pricing, sorting by price sorts by displayed price"

4. **Test passes** - Confirms behavior is now correct

### Current Situation

Since the code has already been changed, we cannot:

- ❌ Write tests for the old (buggy) behavior
- ❌ Establish a baseline of what was broken
- ❌ Use tests to verify the fix

### Alternative Verification Methods

Given this limitation, the following verification methods are recommended:

1. **Manual testing of critical bug fixes** (highest priority)
   - Price sorting actually works correctly now
   - Form submission works with cleared inputs
   - Health check button shows correct colors
   - WebSocket reconnection works

2. **Visual regression testing** (if available)
   - Compare UI before/after changes
   - Ensure no unexpected visual changes

3. **Production monitoring** (after deployment)
   - Watch for error logs related to changed code
   - Monitor key metrics (form submissions, API calls)

4. **Rollback plan** (safety net)
   - Keep git history clean
   - Be ready to revert if issues arise

### Current Test Coverage (as of cleanup completion)

- ✅ 9 test files, 42 tests total
- ✅ categoryHelpers.test.ts (4 tests) - category matching logic
- ✅ productValidation.test.ts (5 tests) - form validation rules
- ✅ useProductForm.test.tsx (2 tests) - form submission behavior
- ✅ pricing.test.ts (11 tests) - price computation logic
- ✅ formConversion.test.ts (6 tests) - form values to Product conversion
- ✅ pricing-behavior.test.ts (4 tests) - price behavior verification (NEW)
- ✅ AddProduct-behavior.test.tsx (4 tests) - form behavior verification (NEW)
- ✅ useProducts-behavior.test.ts (4 tests) - search and sorting behavior (NEW)
- ✅ useWebSocket-behavior.test.ts (2 tests) - WebSocket behavior (structural only, NEW)

## Missing Tests - Critical Changes

### Bug Fixes (PR 1) - Not Tested Against Original Behavior

- [ ] **Price sort test** - verify sorting now uses displayed price
  - CURRENT: Tests computeProductPrice implementation
  - MISSING: Test that product sorting matches displayed prices
  - RISK: Sorting might still be wrong despite new helper

- [ ] **Form number handling test** - verify cleared inputs work
  - CURRENT: Tests formValuesToProduct conversion
  - MISSING: Test that form can be submitted with cleared inputs
  - RISK: Form might still reject cleared inputs

- [ ] **Health check test** - verify button colors and auto-run removed
  - CURRENT: No tests
  - MISSING: Test health check doesn't auto-run on mount
  - MISSING: Test button colors reflect actual status
  - RISK: UX might still have old behavior

- [ ] **WebSocket reconnection test** - verify reconnection behavior
  - CURRENT: No tests
  - MISSING: Test reconnection continues after failure
  - MISSING: Test reconnection stops after unmount
  - RISK: WebSocket might still fail to reconnect

- [ ] **Search null description test** - verify no crash
  - CURRENT: No tests
  - MISSING: Test search with null description doesn't crash
  - RISK: Search might still crash

### Bug Fixes (PR 1)

- [ ] **Price sort test** - `computeProductPrice` helper
  - Test gold weight × rate calculation
  - Test silver weight × rate calculation
  - Test fixed_price takes precedence
  - Test making charges addition
  - Test null/edge cases

- [ ] **WebSocket reconnection test** - `useWebSocket` hook
  - Test reconnection attempts continue after failure
  - Test reconnection stops after unmount
  - Test `isReconnecting` resets before each attempt

- [ ] **Form number handling test** - form submission
  - Test string number fields convert to numbers at submission
  - Test cleared inputs ('') handled correctly
  - Test formValuesToProduct conversion

- [ ] **Search null description test** - `useProducts` hook
  - Test search doesn't crash when description is null

### Dead Code Removal (PR 2)

- [ ] Verify cart slice removal doesn't break Redux store
- [ ] Verify unused hooks removal doesn't break imports

### Architecture Changes (PR 3 & 4)

- [ ] Test GlobalContext removal - metal prices render correctly
- [ ] Test ProtectedRoute component - admin routes protected
- [ ] Test useLocation().state for editable product flow

### Component Splits (PR 5)

- [ ] Test CategoryDropdown hierarchical selection
- [ ] Test Dropdown flat selection
- [ ] Test PrivacyPolicy renders from data file

## Recommended Testing Approach

### Priority 1 - Critical (Must Have)

1. Add unit tests for `computeProductPrice` - affects pricing display and sorting
2. Add unit tests for form number conversion - affects product submission
3. Add integration test for admin add/edit flow - critical business logic

### Priority 2 - Important (Should Have)

1. Add unit tests for WebSocket reconnection - affects real-time updates
2. Add unit tests for ProtectedRoute - affects security
3. Add unit tests for CategoryDropdown - affects category selection

### Priority 3 - Nice to Have

1. Add E2E tests for key user flows
2. Add component snapshot tests
3. Add performance tests

## Manual Testing Checklist (if automated tests not available)

### Home Page

- [ ] Page loads without errors
- [ ] Carousel displays images
- [ ] Metal prices display (on home/products/category pages)

### Product Listing

- [ ] Products display correctly
- [ ] Category filter works
- [ ] Price sort works (low to high, high to low)
- [ ] Metal type filter works

### Admin Flow

- [ ] Login works with correct credentials
- [ ] Admin routes protected (redirect if not admin)
- [ ] Add product form loads
- [ ] Number inputs can be cleared
- [ ] Form submission works
- [ ] Health check button works
- [ ] Edit product loads from location state
- [ ] Edit product submission works

### Other Pages

- [ ] Contact form loads
- [ ] Privacy policy loads
- [ ] About page loads

## Automated Test Strategy

### Unit Tests

- Focus on pure functions and business logic
- Test edge cases and error conditions
- Fast to run and debug

### Integration Tests

- Test component interactions
- Test Redux state changes
- Test API calls with mocks

### E2E Tests (Future)

- Use Playwright or Cypress
- Test critical user journeys
- Run in CI before deployment

## Next Steps

1. Add Priority 1 unit tests (computeProductPrice, form conversion)
2. Run existing tests + new tests
3. If time permits, add Priority 2 tests
4. Commit changes with test coverage
