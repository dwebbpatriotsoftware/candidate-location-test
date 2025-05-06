#!/usr/bin/env node

/**
 * This script generates a secure random string that can be used as the AUTH_SECRET
 * environment variable for Sidebase Auth.
 * 
 * Usage:
 * node scripts/generate-auth-secret.js
 */

const crypto = require('crypto');

// Generate a random string of 32 bytes (256 bits) and encode it as base64
const generateSecret = () => {
  return crypto.randomBytes(32).toString('base64');
};

const secret = generateSecret();

console.log('\nGenerated AUTH_SECRET:');
console.log('------------------------');
console.log(secret);
console.log('------------------------');
console.log('\nAdd this to your .env file:');
console.log(`AUTH_SECRET=${secret}`);
console.log('\nOr set it as an environment variable in your deployment platform.');
