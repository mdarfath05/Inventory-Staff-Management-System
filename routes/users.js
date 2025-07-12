const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db/db');

// Login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) return res.status(500).send('Database error');

    if (results.length === 0) {
      return res.status(401).send('Invalid username or password');
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send('Invalid username or password');

    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.role = user.role;

    if (user.role === 'owner') {
      res.redirect('/dashboard-owner');
    } else {
      res.redirect('/dashboard-staff');
    }
  });
});

// Logout route
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).send('Logout failed');
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
});

// POST /users/add-staff
router.post('/users/add-staff', async (req, res) => {
  const { username, password, salary } = req.body;

  if (req.session.role !== 'owner') {
    return res.status(403).send('Access denied. Only owners can add staff.');
  }

  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) return res.status(500).send('Database error');
    if (results.length > 0) return res.status(409).send('Username already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (username, password, role, salary) VALUES (?, ?, "staff", ?)';
    db.query(sql, [username, hashedPassword, salary], (err) => {
      if (err) return res.status(500).send('Error adding staff');
      res.send('Staff user added successfully!');
    });
  });
});

// GET /users/staff-list
router.get('/users/staff-list', (req, res) => {
  if (req.session.role !== 'owner') {
    return res.status(403).send('Access denied');
  }

  db.query('SELECT id, username, salary FROM users WHERE role = "staff"', (err, results) => {
    if (err) return res.status(500).send('Database error');
    res.json(results);
  });
});

// DELETE /users/delete-staff/:id
router.delete('/users/delete-staff/:id', (req, res) => {
  if (req.session.role !== 'owner') {
    return res.status(403).send('Unauthorized');
  }

  const { id } = req.params;
  db.query('DELETE FROM users WHERE id = ? AND role = "staff"', [id], (err) => {
    if (err) return res.status(500).send('DB error');
    res.send('Staff deleted');
  });
});

// PUT /users/update-salary/:id
router.put('/users/update-salary/:id', express.json(), (req, res) => {
  if (req.session.role !== 'owner') {
    return res.status(403).send('Unauthorized');
  }

  const { id } = req.params;
  const { salary } = req.body;

  const parsedSalary = parseInt(salary);
  if (isNaN(parsedSalary) || parsedSalary <= 0) {
    return res.status(400).send('Invalid salary');
  }

  const sql = 'UPDATE users SET salary = ? WHERE id = ? AND role = "staff"';
  db.query(sql, [parsedSalary, id], (err, result) => {
    if (err) {
      console.error('DB Error:', err);
      return res.status(500).send('Error updating salary');
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Staff not found');
    }
    res.send('Salary updated');
  });
});



module.exports = router;







