# Finora – Personal Finance Management Application

Finora is a full-stack personal finance management application that helps users track income, expenses, budgets, and spending analytics through a secure and responsive web interface.

## Live Demo

https://finora-expense-tracker-project.vercel.app

## Demo Account

Due to email verification requirements in the deployed environment, a pre-verified demo account is provided for easy access to the application.

Use the following credentials to explore the application without creating an account:

**Email:** demo@finora.com  
**Password:** Demo@1234

## GitHub

https://github.com/Sabarisabari1234/finora-expense-tracker-project

## Features

- User registration and secure login
- JWT-based authentication and protected routes
- Email verification
- Password reset through email
- Add, edit, delete, and track expenses
- Income management
- Category-based monthly budgets
- Spending analytics and financial charts
- User-specific financial data
- Responsive interface
- Dark and light theme support

## Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- shadcn/ui

### Backend
- Node.js
- Express.js
- RESTful APIs
- Mongoose

### Database
- MongoDB
- MongoDB Atlas

### Authentication & Security
- JWT
- bcrypt
- Email verification
- Password reset
- Protected API routes

### Email
- Resend

### Deployment
- Vercel – Frontend
- Render – Backend
- MongoDB Atlas – Database

## Project Structure

```text
finora/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
├── src/
│   ├── components/
│   ├── pages/
│   └── App.jsx
└── package.json
