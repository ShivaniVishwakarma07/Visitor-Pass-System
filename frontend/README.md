# Visitor Pass Management System

A full-stack MERN application for managing visitor registrations, appointments, approvals, visitor passes, and entry/exit tracking. The system provides role-based access for administrators, security staff, and employees, with email notifications and QR-code-enabled visitor passes.

## Features

- **Authentication & Authorization:** JWT-based authentication with role-based access control.
- **Visitor Management:** Register, view, search, update, and manage visitor records.
- **Appointment Management:** Schedule appointments and approve or reject requests.
- **Email Notifications:** Send email notifications for appointment updates.
- **Visitor Pass Generation:** Generate passes for approved appointments with QR codes.
- **PDF Pass Download:** Download visitor passes as PDF badges.
- **Check-In & Check-Out:** Record visitor entry and exit using QR scanning or manual pass selection.
- **Visit Logs:** Maintain records of visitor check-in and check-out activity.
- **Dashboard:** View visitor and appointment statistics.
- **CSV Export:** Export supported visitor, appointment, and pass records.

## Technology Stack

**Frontend**

- React.js
- Vite
- JavaScript
- CSS

**Backend**

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- Nodemailer

**Additional Tools & Libraries**

- QR code generation and scanning
- PDF generation
- CSV export

## User Roles

- **Admin:** Manage system operations and access administrative features.
- **Security:** Manage visitor entry, pass generation, and check-in/check-out operations.
- **Employee/Host:** Manage appointments and view relevant visitor passes.
- **Visitor:** Access the visitor-facing functionality permitted by the application.

## Project Structure

```text
Visitor-Pass-Management-System/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   └── package.json
├── .gitignore
└── README.md
```

## Prerequisites

Install the following before running the application:

- Node.js and npm
- MongoDB or a MongoDB Atlas database
- Git

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/ShivaniVishwakarma07/Visitor-Pass-System
cd Visitor-Pass-Management-System
```

### 2. Configure the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder using `.env.example` as a reference. Configure your MongoDB connection, JWT secret, and email credentials.

Required environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_app_password
```

Use your own credentials. Never commit your `.env` file or publish passwords, tokens, or database credentials.

Start the backend using the script configured in `backend/package.json`, for example:

```bash
npm run dev
```

### 3. Configure the frontend

Open a second terminal from the project root:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite in your terminal, typically `http://localhost:5173`.

## Running the Application

Make sure MongoDB is available and both the backend and frontend are running. The frontend communicates with the backend API at `http://localhost:5000/api` in the local development setup.

If your project uses a seed script, run it from the backend folder to create the configured demo users.

## Security Notes

- Keep `.env` files out of Git.
- Use a unique JWT secret and secure email credentials.
- Change demo passwords before using the system in a real environment.
- Configure appropriate database access permissions before deployment.

## Future Improvements

- Deploy the application for public access.
- Add automated testing and audit reporting.
- Improve visitor analytics and administrative reporting.

## Author

**Shivani Vishwakarma**

GitHub: [ShivaniVishwakarma07](https://github.com/ShivaniVishwakarma07)
