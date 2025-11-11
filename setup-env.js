const fs = require('fs');
const path = require('path');

const envContent = `# MongoDB Configuration
MONGODB_URI=mongodb://127.0.0.1:27017/civil360
MONGODB_DB_NAME=civil360

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Session Secret
SESSION_SECRET=your-super-secret-session-key-change-in-production

# Server Configuration
PORT=3000
NODE_ENV=development
`;

const envPath = path.join(__dirname, '.env.local');

if (fs.existsSync(envPath)) {
  console.log('⚠️  .env.local already exists. Skipping...');
  console.log('If you want to reset it, delete .env.local and run this script again.');
} else {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env.local created successfully!');
  console.log('\n📝 Next steps:');
  console.log('1. Make sure MongoDB is running on your machine');
  console.log('2. Update MONGODB_URI in .env.local if needed');
  console.log('3. Run: npm run dev');
  console.log('\n📖 See PERSONNEL_SETUP.md for detailed instructions');
}
