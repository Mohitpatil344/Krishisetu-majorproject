// @ts-check
const { test, expect } = require('@playwright/test');

// Test data
const DUMMY_USERS = {
  farmer: {
    email: 'dummyfarmer@gmail.com',
    password: 'dummy123',
    role: 'farmer',
    profileData: {
      phoneNo: '+91 9876543210',
      location: 'Punjab, India',
      farmSize: '25',
      farmType: 'Traditional Farm',
      primaryCrops: 'Wheat, Rice, Sugarcane',
      farmAddress: 'Village Green Fields, District Farming, Punjab, India'
    }
  },
  business: {
    email: 'dummybusiness@gmail.com',
    password: 'dummy123',
    role: 'business',
    profileData: {
      companyName: 'GreenTech Solutions Pvt Ltd',
      businessType: 'Biofuel Production',
      gstNumber: '27ABCDE1234F1Z5',
      phoneNo: '+91 9876543211',
      location: 'Mumbai, Maharashtra',
      address: 'Industrial Area, Sector 15, Mumbai, Maharashtra, India',
      processingType: 'Biofuel Conversion',
      processingCapacity: '500',
      wasteTypes: ['Crop Residue', 'Rice Husk', 'Wheat Straw']
    }
  }
};

/**
 * Helper function to wait for JWT authentication to complete
 * TODO: Implement JWT authentication waiting logic
 */
async function waitForJWTAuth(page) {
  // TODO: Wait for JWT authentication to complete
  await page.waitForTimeout(2000);
}

/**
 * Helper function to fill and submit registration form
 */
async function fillRegistrationForm(page, userType, profileData) {
  console.log(`Filling ${userType} registration form...`);
  
  if (userType === 'farmer') {
    // Fill farmer registration form
    await page.fill('input[name="phoneNo"]', profileData.phoneNo);
    await page.fill('input[name="location"]', profileData.location);
    await page.fill('input[name="farmSize"]', profileData.farmSize);
    await page.selectOption('select[name="farmType"]', profileData.farmType);
    await page.fill('input[name="primaryCrops"]', profileData.primaryCrops);
    await page.fill('textarea[name="farmAddress"]', profileData.farmAddress);
  } else if (userType === 'business') {
    // Fill business registration form
    await page.fill('input[name="companyName"]', profileData.companyName);
    await page.selectOption('select[name="businessType"]', profileData.businessType);
    await page.fill('input[name="gstNumber"]', profileData.gstNumber);
    await page.fill('input[name="phoneNo"]', profileData.phoneNo);
    await page.fill('input[name="location"]', profileData.location);
    await page.fill('textarea[name="address"]', profileData.address);
    await page.selectOption('select[name="processingType"]', profileData.processingType);
    await page.fill('input[name="processingCapacity"]', profileData.processingCapacity);
    
    // Select waste types (checkboxes)
    for (const wasteType of profileData.wasteTypes) {
      await page.check(`input[type="checkbox"][value="${wasteType}"]`);
    }
  }
  
  // Submit the form
  await page.click('button[type="submit"]');
  console.log(`${userType} registration form submitted`);
}

/**
 * Main test for creating dummy users
 */
test.describe('Dummy User Creation', () => {
  
  test('Create Farmer and Business Dummy Users', async ({ page }) => {
    // Set a longer timeout for this comprehensive test
    test.setTimeout(300000); // 5 minutes
    
    console.log('Starting dummy user creation process...');
    
    // Navigate to the application
    await page.goto('/role-selection');
    await page.waitForLoadState('networkidle');
    
    // Test 1: Create Farmer User
    console.log('=== Creating Farmer User ===');
    await createFarmerUser(page);
    
    // Sign out after farmer creation
    await signOut(page);
    
    // Test 2: Create Business User
    console.log('=== Creating Business User ===');
    await createBusinessUser(page);
    
    console.log('✅ All dummy users created successfully!');
  });
  
  /**
   * Create Farmer User
   */
  async function createFarmerUser(page) {
    const farmer = DUMMY_USERS.farmer;
    
    // Step 1: Navigate to role selection and select farmer
    await page.goto('/role-selection');
    await page.waitForLoadState('networkidle');
    
    // Click on farmer role selection
    await page.click('text=Farmer');
    await page.waitForLoadState('networkidle');
    
    // Step 2: Handle JWT sign-up
    await handleJWTSignUp(page, farmer.email, farmer.password);
    
    // Step 3: Fill farmer registration form
    await page.waitForURL('**/farmer-registration', { timeout: 15000 });
    await fillRegistrationForm(page, 'farmer', farmer.profileData);
    
    // Step 4: Verify successful registration and redirect
    await page.waitForURL('**/farmerDashboard', { timeout: 15000 });
    await expect(page).toHaveURL(/.*farmerDashboard.*/);
    
    console.log('✅ Farmer user created successfully');
  }
  
  /**
   * Create Business User
   */
  async function createBusinessUser(page) {
    const business = DUMMY_USERS.business;
    
    // Step 1: Navigate to role selection and select business
    await page.goto('/role-selection');
    await page.waitForLoadState('networkidle');
    
    // Click on business role selection
    await page.click('text=Business');
    await page.waitForLoadState('networkidle');
    
    // Step 2: Handle JWT sign-up
    await handleJWTSignUp(page, business.email, business.password);
    
    // Step 3: Fill business registration form
    await page.waitForURL('**/business-registration', { timeout: 15000 });
    await fillRegistrationForm(page, 'business', business.profileData);
    
    // Step 4: Verify successful registration and redirect
    await page.waitForURL('**/businessDashboard', { timeout: 15000 });
    await expect(page).toHaveURL(/.*businessDashboard.*/);
    
    console.log('✅ Business user created successfully');
  }
  
  /**
   * Handle JWT sign-up process
   * TODO: Implement JWT authentication logic
   */
  async function handleJWTSignUp(page, email, password) {
    console.log(`Handling JWT sign-up for ${email}...`);
    
    // TODO: Wait for JWT authentication page to load
    await page.waitForLoadState('networkidle');
    
    // TODO: Fill email field
    await page.fill('input[type="email"]', email);
    
    // TODO: Fill password field
    await page.fill('input[type="password"]', password);
    
    // TODO: Click sign-up button
    await page.click('button[type="submit"]');
    
    // TODO: Wait for authentication to complete
    await waitForJWTAuth(page);
    
    console.log('JWT sign-up completed');
  }
  
  /**
   * Sign out from current session
   */
  async function signOut(page) {
    console.log('Signing out...');
    
    try {
      // TODO: Implement JWT sign-out logic
      // Clear local storage or JWT tokens
      await page.evaluate(() => {
        localStorage.removeItem('krishisetu_dummy_auth');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_data');
      });
      
      // Wait for sign-out to complete
      await page.waitForLoadState('networkidle');
    } catch (error) {
      console.log('Sign-out not found or already signed out');
    }
    
    console.log('Signed out successfully');
  }
});

/**
 * Individual test for Farmer User Creation (can be run separately)
 */
test('Create Farmer User Only', async ({ page }) => {
  test.setTimeout(150000); // 2.5 minutes
  
  const farmer = DUMMY_USERS.farmer;
  
  await page.goto('/role-selection');
  await page.waitForLoadState('networkidle');
  
  // Select farmer role
  await page.click('text=Farmer');
  await page.waitForLoadState('networkidle');
  
  // Handle Clerk sign-up
  await handleClerkSignUp(page, farmer.email, farmer.password);
  
  // Fill registration form
  await page.waitForURL('**/farmer-registration', { timeout: 15000 });
  await fillRegistrationForm(page, 'farmer', farmer.profileData);
  
  // Verify redirect to dashboard
  await page.waitForURL('**/farmerDashboard', { timeout: 15000 });
  await expect(page).toHaveURL(/.*farmerDashboard.*/);
  
  console.log('✅ Farmer user created successfully');
});

/**
 * Individual test for Business User Creation (can be run separately)
 */
test('Create Business User Only', async ({ page }) => {
  test.setTimeout(150000); // 2.5 minutes
  
  const business = DUMMY_USERS.business;
  
  await page.goto('/role-selection');
  await page.waitForLoadState('networkidle');
  
  // Select business role
  await page.click('text=Business');
  await page.waitForLoadState('networkidle');
  
  // Handle Clerk sign-up
  await handleClerkSignUp(page, business.email, business.password);
  
  // Fill registration form
  await page.waitForURL('**/business-registration', { timeout: 15000 });
  await fillRegistrationForm(page, 'business', business.profileData);
  
  // Verify redirect to dashboard
  await page.waitForURL('**/businessDashboard', { timeout: 15000 });
  await expect(page).toHaveURL(/.*businessDashboard.*/);
  
  console.log('✅ Business user created successfully');
});

// Helper functions (accessible to all tests)
async function handleClerkSignUp(page, email, password) {
  console.log(`Handling Clerk sign-up for ${email}...`);
  
  await page.waitForLoadState('networkidle');
  
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  
  await waitForClerkAuth(page);
  
  console.log('Clerk sign-up completed');
}

async function waitForClerkAuth(page) {
  await page.waitForSelector('[data-clerk-element="userButton"], [data-clerk-element="signInButton"]', { timeout: 10000 });
  await page.waitForTimeout(2000);
}

async function fillRegistrationForm(page, userType, profileData) {
  console.log(`Filling ${userType} registration form...`);
  
  if (userType === 'farmer') {
    await page.fill('input[name="phoneNo"]', profileData.phoneNo);
    await page.fill('input[name="location"]', profileData.location);
    await page.fill('input[name="farmSize"]', profileData.farmSize);
    await page.selectOption('select[name="farmType"]', profileData.farmType);
    await page.fill('input[name="primaryCrops"]', profileData.primaryCrops);
    await page.fill('textarea[name="farmAddress"]', profileData.farmAddress);
  } else if (userType === 'business') {
    await page.fill('input[name="companyName"]', profileData.companyName);
    await page.selectOption('select[name="businessType"]', profileData.businessType);
    await page.fill('input[name="gstNumber"]', profileData.gstNumber);
    await page.fill('input[name="phoneNo"]', profileData.phoneNo);
    await page.fill('input[name="location"]', profileData.location);
    await page.fill('textarea[name="address"]', profileData.address);
    await page.selectOption('select[name="processingType"]', profileData.processingType);
    await page.fill('input[name="processingCapacity"]', profileData.processingCapacity);
    
    for (const wasteType of profileData.wasteTypes) {
      await page.check(`input[type="checkbox"][value="${wasteType}"]`);
    }
  }
  
  await page.click('button[type="submit"]');
  console.log(`${userType} registration form submitted`);
}
