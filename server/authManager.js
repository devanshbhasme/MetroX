const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const CPP_DATA_DIR = path.join(__dirname, '..', 'MetroX Project', 'metrox', 'data');
const PASSENGERS_TXT = path.join(CPP_DATA_DIR, 'passengers.txt');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Simple salt + hash helper
function hashPassword(password) {
  return crypto.createHash('sha256').update(password + '_metrox_transit_salt_2026').digest('hex');
}

// Generate simple opaque session token
function generateToken(userId, role) {
  const payload = `${userId}:${role}:${Date.now()}`;
  return crypto.createHmac('sha256', 'metrox_secret_key_2026').update(payload).digest('hex');
}

// Initial default seed users
const defaultAuthData = {
  admins: [
    {
      id: 'ADM-001',
      name: 'Transit Authority Officer',
      email: 'admin@metrox.gov',
      passwordHash: hashPassword('admin123'),
      role: 'admin',
      department: 'Central Traffic Command'
    }
  ],
  customers: [
    {
      id: 1,
      name: 'Alex Morgan',
      email: 'alex.morgan@email.com',
      phone: '+91 9823011223',
      passwordHash: hashPassword('metro123'),
      role: 'passenger',
      category: 'Regular',
      smartCardBalance: 320.0,
      createdAt: '2026-10-20T10:00:00.000Z'
    },
    {
      id: 2,
      name: 'David Chen',
      email: 'david.chen@univ.edu',
      phone: '+91 9845122334',
      passwordHash: hashPassword('metro123'),
      role: 'passenger',
      category: 'Student',
      collegeName: 'National Institute of Tech',
      studentId: 'STU-8821',
      smartCardBalance: 450.0,
      createdAt: '2026-10-20T10:00:00.000Z'
    },
    {
      id: 3,
      name: 'Robert Wilson',
      email: 'r.wilson@seniorcare.org',
      phone: '+91 9765432109',
      passwordHash: hashPassword('metro123'),
      role: 'passenger',
      category: 'Senior',
      age: 68,
      seniorId: 'SR-55201',
      smartCardBalance: 600.0,
      createdAt: '2026-10-20T10:00:00.000Z'
    }
  ]
};

function readAuthFile() {
  try {
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, JSON.stringify(defaultAuthData, null, 2), 'utf-8');
      return defaultAuthData;
    }
    const content = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading users.json:', err);
    return defaultAuthData;
  }
}

function writeAuthFile(data) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing users.json:', err);
    return false;
  }
}

// Sync passenger record to C++ passengers.txt if present
function syncToCppPassengersTxt(customer) {
  try {
    if (!fs.existsSync(PASSENGERS_TXT)) return;
    let line = '';
    if (customer.category === 'Student') {
      line = `STUDENT|${customer.id}|${customer.name}|${customer.email}|${customer.collegeName || 'City College'}|${customer.studentId || 'STU-' + customer.id}\n`;
    } else if (customer.category === 'Senior') {
      line = `SENIOR|${customer.id}|${customer.name}|${customer.email}|${customer.age || 65}|${customer.seniorId || 'SR-' + customer.id}\n`;
    } else {
      line = `REGULAR|${customer.id}|${customer.name}|${customer.email}\n`;
    }

    const currentContent = fs.readFileSync(PASSENGERS_TXT, 'utf-8');
    // Check if customer email already exists in passengers.txt
    if (!currentContent.includes(`|${customer.email}|`)) {
      fs.appendFileSync(PASSENGERS_TXT, line, 'utf-8');
      console.log(`[AuthManager] Appended passenger #${customer.id} to C++ passengers.txt`);
    }
  } catch (err) {
    console.warn('[AuthManager] Could not append to C++ passengers.txt:', err.message);
  }
}

// ------------------- AUTH SERVICES -------------------

// Customer Sign Up
function customerSignUp({ name, email, phone, password, category = 'Regular', collegeName, studentId, age, seniorId }) {
  if (!name || !email || !password) {
    throw new Error('Name, email, and password are required.');
  }

  const authData = readAuthFile();
  const existing = authData.customers.find(c => c.email.toLowerCase() === email.trim().toLowerCase());
  if (existing) {
    throw new Error('An account with this email address already exists. Please sign in.');
  }

  // Generate next customer ID
  const maxId = authData.customers.reduce((max, c) => Math.max(max, Number(c.id) || 0), 0);
  const newId = maxId + 1;

  const newCustomer = {
    id: newId,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: (phone || '').trim(),
    passwordHash: hashPassword(password),
    role: 'passenger',
    category: category || 'Regular',
    collegeName: collegeName ? collegeName.trim() : undefined,
    studentId: studentId ? studentId.trim() : undefined,
    age: age ? Number(age) : undefined,
    seniorId: seniorId ? seniorId.trim() : undefined,
    smartCardBalance: 100.0, // ₹100 welcome transit credit
    createdAt: new Date().toISOString()
  };

  authData.customers.push(newCustomer);
  writeAuthFile(authData);

  // Sync to C++ passengers.txt
  syncToCppPassengersTxt(newCustomer);

  const token = generateToken(newCustomer.id, 'passenger');
  const { passwordHash: _, ...userWithoutPassword } = newCustomer;

  return {
    user: userWithoutPassword,
    token
  };
}

// Customer Sign In
function customerSignIn({ email, password }) {
  if (!email || !password) {
    throw new Error('Please enter both email and password.');
  }

  const authData = readAuthFile();
  const customer = authData.customers.find(c => c.email.toLowerCase() === email.trim().toLowerCase());
  if (!customer) {
    throw new Error('No customer account found with this email.');
  }

  const hash = hashPassword(password);
  if (customer.passwordHash !== hash) {
    throw new Error('Incorrect password. Please verify and try again.');
  }

  const token = generateToken(customer.id, 'passenger');
  const { passwordHash: _, ...userWithoutPassword } = customer;

  return {
    user: userWithoutPassword,
    token
  };
}

// Admin Sign In
function adminSignIn({ email, password, securityKey }) {
  if (!email || !password) {
    throw new Error('Please provide admin email and password.');
  }

  const authData = readAuthFile();
  const admin = authData.admins.find(a => a.email.toLowerCase() === email.trim().toLowerCase());
  if (!admin) {
    throw new Error('Invalid authority credentials. Admin email not recognized.');
  }

  const hash = hashPassword(password);
  if (admin.passwordHash !== hash) {
    throw new Error('Invalid administrative password.');
  }

  // Security key verification (optional extra layer, accepts metrox2026 or blank for demo)
  if (securityKey && securityKey.trim() !== 'metrox2026' && securityKey.trim() !== 'admin') {
    throw new Error('Invalid Security Clearance Key.');
  }

  const token = generateToken(admin.id, 'admin');
  const { passwordHash: _, ...adminWithoutPassword } = admin;

  return {
    user: adminWithoutPassword,
    token
  };
}

// Get User by ID and Role
function getUserById(id, role) {
  const authData = readAuthFile();
  if (role === 'admin') {
    const admin = authData.admins.find(a => a.id === id);
    if (!admin) return null;
    const { passwordHash: _, ...rest } = admin;
    return rest;
  } else {
    const customer = authData.customers.find(c => c.id === Number(id));
    if (!customer) return null;
    const { passwordHash: _, ...rest } = customer;
    return rest;
  }
}

// Update Customer Balance
function updateCustomerBalance(customerId, amountToAdd) {
  const authData = readAuthFile();
  const customer = authData.customers.find(c => c.id === Number(customerId));
  if (!customer) throw new Error('Customer not found');

  customer.smartCardBalance = Math.max(0, parseFloat((customer.smartCardBalance + amountToAdd).toFixed(2)));
  writeAuthFile(authData);

  const { passwordHash: _, ...rest } = customer;
  return rest;
}

module.exports = {
  customerSignUp,
  customerSignIn,
  adminSignIn,
  getUserById,
  updateCustomerBalance
};
