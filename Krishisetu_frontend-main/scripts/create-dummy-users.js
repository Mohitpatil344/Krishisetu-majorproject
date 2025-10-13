#!/usr/bin/env node

/**
 * Dummy User Creation Script
 * 
 * This script creates dummy users for the KrishiSetu application
 * using Playwright automation.
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Starting KrishiSetu Dummy User Creation...\n');

try {
  // Check if Playwright is installed
  console.log('📦 Checking Playwright installation...');
  execSync('npx playwright --version', { stdio: 'pipe' });
  console.log('✅ Playwright is installed\n');

  // Run the dummy user creation tests
  console.log('🎭 Running dummy user creation tests...');
  console.log('This will create:');
  console.log('  - Farmer user: dummyfarmer@gmail.com');
  console.log('  - Business user: dummybusiness@gmail.com');
  console.log('  - Password for both: dummy123');
  console.log('  - NOTE: JWT authentication will be implemented\n');

  // Run the tests
  execSync('npx playwright test tests/dummy-users.spec.js --project=chromium --headed', {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });

  console.log('\n✅ Dummy users created successfully!');
  console.log('\n📋 Created Users:');
  console.log('  👨‍🌾 Farmer: dummyfarmer@gmail.com');
  console.log('  🏢 Business: dummybusiness@gmail.com');
  console.log('  🔑 Password: dummy123');
  console.log('\n🎯 You can now use these accounts for testing your application!');

} catch (error) {
  console.error('\n❌ Error creating dummy users:');
  console.error(error.message);
  
  console.log('\n🔧 Troubleshooting:');
  console.log('1. Make sure your React app is running on http://localhost:3000');
  console.log('2. Ensure JWT authentication is properly configured');
  console.log('3. Check that all required environment variables are set');
  console.log('4. Verify that the role selection and registration pages are working');
  
  process.exit(1);
}
