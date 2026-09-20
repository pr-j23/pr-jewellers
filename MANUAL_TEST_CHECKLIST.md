# Manual Testing Checklist - pr-jewellers

## Purpose

Verify that the application works end-to-end without breaking any existing behavior after the cleanup changes.

## Critical Requirements

- ✅ All pages must load without errors
- ✅ All user flows must work correctly
- ✅ No unintended behavior changes
- ✅ Bug fixes must work (price sorting, form inputs, etc.)

---

## Test Environment

- URL: http://localhost:5173
- Branch: fix/pr-1-bug-fixes
- Dev server: Running

---

## Testing Checklist

### 1. Home Page

- [ ] Page loads without console errors
- [ ] Carousel displays images and works (auto-scrolls, navigation arrows)
- [ ] Metal prices display (gold and silver rates)
- [ ] Navigation menu works (Home, Products, About, Contact)
- [ ] Footer displays correctly
- [ ] Social media links work (if any)

### 2. Products Page

- [ ] Page loads without errors
- [ ] Product grid displays all products
- [ ] Product cards display correctly (image, name, price)
- [ ] Price display matches expected (weight × rate or fixed_price)
- [ ] Filter dropdowns work (Category, Metal Type)
- [ ] Sort dropdown works (Price Low-High, Price High-Low)
- [ ] **CRITICAL**: Price sorting now uses computed prices (not just fixed_price)
  - Test: Sort by Price Low-High
  - Verify: Products with weight-based pricing sort correctly
  - Example: Silver chain (100g) should be cheaper than gold ring (10g)

### 3. Category Pages

- [ ] Click on a category from home or products page
- [ ] Category page loads and shows filtered products
- [ ] Metal prices still display on category page
- [ ] Back navigation works

### 4. Category Dropdown

- [ ] Category dropdown opens on click
- [ ] Parent categories display
- [ ] Hovering over parent shows subcategories
- [ ] Clicking subcategory selects it
- [ ] Search in category dropdown works
- [ ] "All Products" option works

### 5. Admin Login

- [ ] Navigate to /admin or click Admin link
- [ ] Login page loads
- [ ] Enter correct credentials (check appConfig.ts for password)
- [ ] Login button enables when credentials match
- [ ] After login, redirected to admin area
- [ ] **CRITICAL**: Unauthorized users cannot access admin routes
  - Test: Try to access /admin/add-product without login
  - Expected: Redirected to home page

### 6. Add Product Flow

- [ ] Navigate to /admin/add-product
- [ ] Form loads without errors
- [ ] All form fields display correctly
- [ ] **CRITICAL**: Number inputs can be cleared
  - Test: Enter value in weight field, then clear it
  - Expected: Field clears, no error
- [ ] **CRITICAL**: Form submission works with cleared inputs
  - Test: Clear weight/fixed_price/making_charges fields
  - Expected: Form submits with 0 for those fields
- [ ] Category dropdown works (hierarchical selection)
- [ ] Metal type dropdown works
- [ ] Image upload works
- [ ] **CRITICAL**: Health check button
  - Test: Click health check button
  - Expected: API call made, button color reflects status
  - Expected: Green on success, red on error
  - **CRITICAL**: Health check does NOT auto-run on mount
  - Test: Reload page, check network tab
  - Expected: No health check API call on load
- [ ] Submit form successfully
- [ ] Product added to database
- [ ] Redirect after successful submission

### 7. Edit Product Flow

- [ ] Click "Edit" on a product card
- [ ] **CRITICAL**: Edit page loads with product data from route state
  - Test: Check URL state/location state
  - Expected: Product data passed via navigation state
- [ ] Form pre-filled with existing product data
- [ ] Number fields show existing values correctly
- [ ] Can modify all fields
- [ **CRITICAL**: Cleared inputs convert to zero at submission
- [ ] Image upload allows adding/removing images
- [ ] Submit form successfully
- [ ] Product updated in database
- [ ] Redirect after successful submission

### 8. Contact Form

- [ ] Navigate to Contact page
- [ ] Form loads without errors
- [ ] All fields display correctly
- [ ] Form validation works
- [ ] Submit form successfully
- [ ] Success message displays

### 9. Privacy Policy

- [ ] Navigate to Privacy Policy page
- [ ] Page loads without errors
- [ ] Content displays correctly (loaded from data file)
- [ **CRITICAL**: No inline JSX, content from privacyPolicyContent.ts

### 10. About Page

- [ ] Navigate to About page
- [ ] Page loads without errors
- [ ] Content displays correctly

### 11. Metal Prices Display

- [ ] Metal prices display on Home page
- [ ] Metal prices display on Products page
- [ ] Metal prices display on Category pages
- [ ] **CRITICAL**: Metal prices update via WebSocket
  - Test: Wait for WebSocket connection
  - Expected: Metal prices update automatically when server sends update
  - **CRITICAL**: WebSocket reconnection works after disconnection
  - Test: Disconnect network, then reconnect
  - Expected: WebSocket reconnects automatically

### 12. Product Price Display

- [ ] Products with fixed_price display that price
- [ ] Products with weight display calculated price (weight × rate + making_charges)
- [ ] **CRITICAL**: Price calculation matches ProductCard logic
  - Test: Check a gold ring with weight 10g
  - Expected: Price = 10g × gold_rate + making_charges
- [ ] Price display matches sorted order

### 13. Search Functionality

- [ ] Search box on Products page works
- [ ] **CRITICAL**: Search doesn't crash on null descriptions
  - Test: Search for a product with null description
  - Expected: No crash, search works correctly
- [ ] Search filters by name
- [ ] Search filters by description
- [ ] Search results update in real-time

### 14. Responsive Design

- [ ] Site works on desktop
- [ ] Site works on mobile (if possible to test)
- [ ] Carousel works on different screen sizes
- [ ] Navigation works on mobile

### 15. Console Errors

- [ ] No console errors on page load
- [ ] No console errors during navigation
- [ ] No console errors during form submission
- [ ] No console errors during WebSocket updates

---

## Bug Fix Verification

### Price Sorting Bug Fix

- [ ] Navigate to Products page
- [ ] Sort by Price Low-High
- [ ] Verify: Products with weight-based pricing sort by computed price
- [ ] Verify: Not sorting by fixed_price only

### Form Number Input Bug Fix

- [ ] Navigate to Add Product
- [ ] Enter value in weight field
- [ ] Clear the field
- [ ] Expected: Field clears without error
- [ ] Submit form
- [ ] Expected: Form submits with weight = 0

### Health Check Bug Fix

- [ ] Navigate to Add Product
- [ ] Reload page
- [ ] Check network tab
- [ ] Expected: No health check API call on load
- [ ] Click health check button
- [ ] Expected: API call made
- [ ] Expected: Button green on success, red on error

### Search Null Description Bug Fix

- [ ] Navigate to Products page
- [ ] Search for any term
- [ ] Expected: No crash even if product has null description

### WebSocket Reconnection Bug Fix

- [ ] Navigate to Home page
- [ ] Disconnect network (dev tools)
- [ ] Reconnect network
- [ ] Expected: WebSocket reconnects automatically
- [ ] Expected: Metal prices update after reconnection

---

## Regression Testing

### GlobalContext Removal

- [ ] Metal prices still display correctly
- [ ] No errors related to GlobalContext
- [ ] Metal prices display on correct pages (home, products, category)

### Redux Saga Removal

- [ ] Products load correctly
- [ ] No errors related to Redux Saga
- [ ] fetchProducts works correctly

### ProtectedRoute Addition

- [ ] Admin routes protected
- [ ] Unauthorized users redirected to home

### useProductForm Split

- [ ] Form still works correctly
- [ ] Health check still works
- [ ] Image upload still works

### CategoryDropdown Component

- [ ] Category selection works
- [ ] Hierarchical selection works
- [ ] Search in category works

---

## Success Criteria

All items must pass:

- ✅ No console errors
- ✅ All pages load correctly
- ✅ All user flows work
- ✅ All bug fixes verified
- ✅ No unintended behavior changes

---

## Notes

Document any issues found:

- [Issue description]
- [Steps to reproduce]
- [Expected vs actual behavior]
