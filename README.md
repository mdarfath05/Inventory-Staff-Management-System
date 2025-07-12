📦 Inventory & Staff Management System
A simple yet powerful full-stack web application that allows an owner to efficiently manage inventory and staff details. Built using Node.js, Express.js, EJS, and MySQL, the system supports authentication, product tracking, stock threshold alerts, staff salary control, and role-based dashboards.

🔧 Tech Stack
Frontend: HTML, CSS, EJS Templates

Backend: Node.js, Express.js

Database: MySQL

Session Management: express-session

Password Encryption: bcrypt

👤 Roles & Permissions
Owner:

Login access

Dashboard access

Add, update, delete products

Low stock alerts

Add, delete staff

View & update staff salaries

Staff:

Login access

Dashboard access (view only)

Sell products (reduce stock quantity)

📁 Features
✅ Authentication
Login system with role-based access

Sessions maintained for secure routing

✅ Product Management
Add, update, delete products

Set and monitor restock thresholds

Auto display of low-stock items

Total value calculated as (price × quantity)

✅ Staff Management
Owner can add new staff with salary

View current staff list in a table

Update staff salary with validation

Delete staff records

Salary input change check to prevent unnecessary updates

✅ Responsive UI
Clean layout using EJS templates and CSS

Logout button and navigation maintained on all views

