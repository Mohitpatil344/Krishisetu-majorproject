#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Krishisetu Backend...\n');

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Created .env file from .env.example');
  } else {
    // Create basic .env file
    const envContent = `# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/krishisetu

# JWT Secret (CHANGE THIS IN PRODUCTION!)
JWT_SECRET=your_super_secret_jwt_key_here_${Date.now()}

# Email Configuration (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password

# Frontend URL
FRONTEND_URL=http://localhost:3000
`;
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created .env file with default values');
  }
} else {
  console.log('✅ .env file already exists');
}

console.log('\n📋 Next steps:');
console.log('1. Update .env file with your configuration:');
console.log('   - Set MONGODB_URI (local or Atlas)');
console.log('   - Set JWT_SECRET (strong secret)');
console.log('   - Set EMAIL_USER (your Gmail)');
console.log('   - Set EMAIL_PASSWORD (Gmail app password)');
console.log('\n2. Install dependencies:');
console.log('   npm install');
console.log('\n3. Start the server:');
console.log('   npm run dev');
console.log('\n4. Test the API:');
console.log('   curl http://localhost:5000/health');
console.log('\n🎉 Setup complete!');
