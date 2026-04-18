# Enjaz Backend 🚀

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v20-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.19.2-red.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.3-green.svg)](https://mongodb.com/)

## 📖 Overview

**Enjaz Backend** is a robust, scalable RESTful API built with Node.js and Express.js for a modern task management application. It provides secure user authentication, task CRUD operations, and is designed to power a responsive frontend application.

## ✨ Features

- 🔐 **Secure Authentication**: JWT-based auth with bcrypt password hashing
- 📝 **Task Management**: Full CRUD operations for tasks
- 🛡️ **Security**: Helmet, CORS, rate limiting, input validation
- ⚡ **Performance**: Optimized MongoDB with Mongoose ODM
- 🧪 **Error Handling**: Global error handler with structured responses
- 📊 **Logging**: Morgan for request logging in development
- ✅ **Health Checks**: `/api/health` endpoint
- 🔄 **Cookie Management**: Secure cookie utilities for auth tokens

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Runtime** | Node.js ^20 |
| **Framework** | Express.js ^4.19.2 |
| **Database** | MongoDB + Mongoose ^8.3.0 |
| **Auth** | JWT ^9.0.2, bcryptjs ^2.4.3 |
| **Security** | helmet ^7.1.0, express-rate-limit ^7.2.0 |
| **Validation** | express-validator ^7.0.1 |
| **Utils** | dotenv ^16.4.5, cookie-parser ^1.4.6 |

## 📋 Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn
- Git

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/enjaz.git
cd enjaz/backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create `.env` file
Copy `.env.example` to `.env` and fill in your values:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/enjaz
JWT_SECRET=your-super-secret-jwt-key-minimum-32-chars
JWT_EXPIRES_IN=90d
COOKIE_EXPIRES_IN=90
CLIENT_URL=http://localhost:4200
```

### 4. Run the application
```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

Server will be available at `http://localhost:5000`

### 5. Test Health Check
```bash
curl http://localhost:5000/api/health
```

## 📚 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/v1/auth/register` | Register new user | No |
| `POST` | `/api/v1/auth/login` | User login | No |
| `GET` | `/api/v1/tasks` | Get user tasks | Yes |
| `POST` | `/api/v1/tasks` | Create new task | Yes |
| `GET` | `/api/v1/tasks/:id` | Get single task | Yes |
| `PUT` | `/api/v1/tasks/:id` | Update task | Yes |
| `DELETE` | `/api/v1/tasks/:id` | Delete task | Yes |
| `GET` | `/api/health` | Health check | No |

## 🏗 Project Structure

```
backend/
├── server.js                 # Entry point
├── src/
│   ├── app.js               # Express app setup
│   ├── config/              # Environment & DB config
│   ├── middlewares/         # Custom middleware
│   ├── modules/             # Feature modules
│   │   ├── auth/           # Authentication module
│   │   └── tasks/          # Tasks module
│   └── utils/              # Utility functions
├── package.json
└── .env.example
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | development |
| `PORT` | Server port | 5000 |
| `MONGO_URI` | MongoDB connection string | |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | |
| `JWT_EXPIRES_IN` | JWT expiry time | 90d |
| `COOKIE_EXPIRES_IN` | Cookie expiry | 90 |
| `CLIENT_URL` | Frontend URL for CORS | http://localhost:4200 |

## 🧪 Testing

Add your test scripts to `package.json`:
```json
"scripts": {
  "test": "jest",
  "test:watch": "jest --watch"
}
```

## 🚀 Deployment

Recommended for production:

1. **Process Manager**: PM2
```bash
npm i -g pm2
pm2 start ecosystem.config.js
```

2. **Environment**: Use Docker or cloud platform environment variables

3. **Database**: MongoDB Atlas for managed hosting

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**⭐ Star this repository if you found it helpful!**
