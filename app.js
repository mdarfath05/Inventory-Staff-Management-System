const express = require('express');
const bodyParser = require('body-parser'); 
const session = require('express-session');
const path = require('path');
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session config
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
    }
}));

// Make username available in EJS templates
app.use((req, res, next) => {
    res.locals.username = req.session.username;
    next();
});

// Prevent caching to block back-navigation after logout
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});

// Routes
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
app.use('/', userRoutes);
app.use('/', productRoutes);

// Home Page
app.get('/', (req, res) => {
    res.render('index');
});

// Middleware for role-based access
function requireLogin(role) {
    return (req, res, next) => {
        if (!req.session.username || req.session.role !== role) {
            return res.redirect('/login');
        }
        next();
    };
}

// Dashboards (Protected Routes)
app.get('/dashboard-owner', requireLogin('owner'), (req, res) => {
    res.render('owner-dashboard', { username: req.session.username }); // ✅ new view
});

app.get('/dashboard-staff', requireLogin('staff'), (req, res) => {
    res.render('staff', { username: req.session.username });
});

// Owner Sub-Pages (Modularized)
app.get('/owner/products', requireLogin('owner'), (req, res) => {
    res.render('owner-products', { username: req.session.username }); // ✅
});

app.get('/owner/staff', requireLogin('owner'), (req, res) => {
    res.render('owner-staff', { username: req.session.username }); // ✅
});

// Login Page
app.get('/login', (req, res) => {
    res.render('login');
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});



