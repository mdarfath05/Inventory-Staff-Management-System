const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Parse JSON bodies
router.use(express.json());

// GET all products
router.get('/products', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) return res.status(500).send('DB Error');
        res.json(results);
    });
});

// POST add product
router.post('/products', (req, res) => {
    const { name, quantity, price, threshold } = req.body;

    if (!name || !quantity || !price || !threshold) {
        return res.status(400).send('Missing fields');
    }

    const sql = 'INSERT INTO products (name, quantity, price, threshold) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, quantity, price, threshold], (err, result) => {
        if (err) return res.status(500).send('Error adding product');
        res.send('Product added');
    });
});

// PUT update product
router.put('/products/:id', (req, res) => {
    const { id } = req.params;
    const { name, quantity, price, threshold } = req.body;

    const sql = `
        UPDATE products
        SET name = ?, quantity = ?, price = ?, threshold = ?
        WHERE id = ?
    `;
    db.query(sql, [name, quantity, price, threshold, id], (err, result) => {
        if (err) return res.status(500).send('Update failed');
        res.send('Product updated');
    });
});

// DELETE product
router.delete('/products/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM products WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).send('Delete error');
        res.send('Product deleted');
    });
});

// PUT: Record a sale by reducing product quantity
router.put('/products/sell/:id', (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
        return res.status(400).send('Invalid quantity');
    }

    db.query('SELECT quantity FROM products WHERE id = ?', [id], (err, results) => {
        if (err || results.length === 0) return res.status(500).send('Product not found');

        const currentQty = results[0].quantity;
        if (quantity > currentQty) return res.status(400).send('Not enough stock');

        const updatedQty = currentQty - quantity;
        db.query('UPDATE products SET quantity = ? WHERE id = ?', [updatedQty, id], (err) => {
            if (err) return res.status(500).send('Error updating quantity');
            res.send('Sale recorded');
        });
    });
});

module.exports = router;

// PUT update product
router.put('/products/:id', (req, res) => {
    const { id } = req.params;
    const { name, quantity, price, threshold } = req.body;

    const sql = `
        UPDATE products
        SET name = ?, quantity = ?, price = ?, threshold = ?
        WHERE id = ?
    `;
    db.query(sql, [name, quantity, price, threshold, id], (err, result) => {
        if (err) return res.status(500).send('Update failed');
        res.send('Product updated');
    });
});

// DELETE product
router.delete('/products/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM products WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).send('Delete error');
        res.send('Product deleted');
    });
});

// ✅ PUT: Record a sale by reducing product quantity
router.put('/products/sell/:id', (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
        return res.status(400).send('Invalid quantity');
    }

    db.query('SELECT quantity FROM products WHERE id = ?', [id], (err, results) => {
        if (err || results.length === 0) return res.status(500).send('Product not found');

        const currentQty = results[0].quantity;
        if (quantity > currentQty) return res.status(400).send('Not enough stock');

        const updatedQty = currentQty - quantity;
        db.query('UPDATE products SET quantity = ? WHERE id = ?', [updatedQty, id], (err) => {
            if (err) return res.status(500).send('Error updating quantity');
            res.send('Sale recorded');
        });
    });
});

module.exports = router;
