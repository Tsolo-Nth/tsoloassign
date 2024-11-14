// server.js (backend)

const express = require('express');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5300;

// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // replace with your MySQL user
  password: '123456', // replace with your MySQL password
  database: 'inventory_system' // replace with your database name
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL database');
});

// Registration endpoint
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // Check if user already exists
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error checking user existence' });
    }
    if (results.length > 0) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    // Hash the password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ error: 'Error hashing password' });
      }

      // Insert user into the database
      db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Error saving user' });
        }

        res.status(200).json({ message: 'User registered successfully' });
      });
    });
  });
});

// Login API
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if the username and password are provided
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // Check if the user exists
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error checking user existence' });
    }

    // If user not found
    if (results.length === 0) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const user = results[0];

    // Compare the hashed password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ error: 'Error comparing passwords' });
      }
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid username or password' });
      }

      res.json({ message: 'Login successful' });
    });
  });
});

// Fetch all products
app.get('/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

// Add a new product
app.post('/products', (req, res) => {
  const { name, description, category, price, quantity } = req.body;
  db.query(
    'INSERT INTO products (name, description, category, price, quantity) VALUES (?, ?, ?, ?, ?)',
    [name, description, category, price, quantity],
    (err) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({ message: 'Product added successfully' });
    }
  );
});

// Update a product
app.put('/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, category, price, quantity } = req.body;
  db.query(
    'UPDATE products SET name = ?, description = ?, category = ?, price = ?, quantity = ? WHERE id = ?',
    [name, description, category, price, quantity, id],
    (err) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({ message: 'Product updated successfully' });
    }
  );
});

// Delete a product
app.delete('/products/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM products WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ message: 'Product deleted successfully' });
  });
});

// Fetch all users (for debugging/admin purposes)
app.get('/users', (req, res) => {
  db.query('SELECT username FROM users', (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

// Update a user (for admin)
app.put('/users', (req, res) => {
  const { oldUsername, newUsername, newPassword } = req.body;
  db.query(
    'UPDATE users SET username = ?, password = ? WHERE username = ?',
    [newUsername, newPassword, oldUsername],
    (err) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({ message: 'User updated successfully' });
    }
  );
});

// Delete a user (for admin)
app.delete('/users', (req, res) => {
  const { username } = req.body;
  db.query('DELETE FROM users WHERE username = ?', [username], (err) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ message: 'User deleted successfully' });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
