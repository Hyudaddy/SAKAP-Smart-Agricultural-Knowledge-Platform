// Test script to verify file upload functionality
const fs = require('fs');
const path = require('path');

// Create a simple test file
const testContent = `This is a test document for the SAKAP Agricultural Assistance Platform.
It contains sample content that would be used for testing the file upload functionality.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

// Write test file
fs.writeFileSync(path.join(__dirname, 'test-document.txt'), testContent);
console.log('Test file created successfully!');

console.log('\nTo test the file upload functionality:');
console.log('1. Open the admin panel at http://localhost:8080');
console.log('2. Navigate to the Manage E-Library page');
console.log('3. Click "Add Content"');
console.log('4. Fill in the form and upload the test-document.txt file');
console.log('5. Verify that the file appears in the library list');
console.log('6. Check that the file can be downloaded from the user-facing E-Library page');