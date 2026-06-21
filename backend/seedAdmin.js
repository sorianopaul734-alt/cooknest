/**
 * One-time script to create (or promote) the CookNest admin account.
 *
 * Usage (from the backend folder, with your .env / Railway vars available):
 *   node seedAdmin.js admin@cooknest.com "YourStrongPassword123" "Admin"
 *
 * Safe to run more than once — if the email already exists it just
 * updates the password hash and sets role='admin'.
 *
 * IMPORTANT: delete or stop using this script's printed password reminder
 * once you've logged in. Don't commit real passwords to git.
 */
require('dotenv').config();

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function main() {
  const [, , email, password, name = 'Admin'] = process.argv;

  if (!email || !password) {
    console.error('Usage: node seedAdmin.js <email> <password> [name]');
    process.exit(1);
  }
  if (password.length < 6) {
    console.error('Password must be at least 6 characters.');
    process.exit(1);
  }

  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
  });

  const hash = await bcrypt.hash(password, 10);

  const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
  if (existing.length > 0) {
    await db.query('UPDATE users SET password = ?, role = ?, name = ? WHERE email = ?',
      [hash, 'admin', name, email]);
    console.log(`Updated existing user "${email}" -> role=admin, password reset.`);
  } else {
    await db.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hash, 'admin']);
    console.log(`Created new admin user "${email}".`);
  }

  await db.end();
  console.log('Done. You can now log in with this email/password on /admin.html');
}

main().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});

console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PORT:', process.env.DB_PORT);
