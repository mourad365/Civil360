import bcrypt from 'bcryptjs';

const storedHash = '$2a$10$yijE9zSCnRy0/7PC3zJCO.UyXGtoNB6iVEqUiB1gEpk8H2fae7n7C';
const testPassword = '123456';

console.log('Testing password verification...');
console.log('Stored hash:', storedHash);
console.log('Test password:', testPassword);

bcrypt.compare(testPassword, storedHash)
  .then(result => {
    console.log('\n✅ Password match result:', result);
    if (result) {
      console.log('✅ Password "123456" matches the stored hash!');
    } else {
      console.log('❌ Password "123456" does NOT match the stored hash');
      console.log('\nTrying to generate a new hash for comparison...');
      return bcrypt.hash(testPassword, 10);
    }
  })
  .then(newHash => {
    if (newHash) {
      console.log('New hash for "123456":', newHash);
    }
  })
  .catch(error => {
    console.error('❌ Error:', error);
  });
