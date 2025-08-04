
# EssadaJS

<p align="center">
  <img src="./icon.png" alt="EssadaJS Icon" width="500">
</p>

A modern, scalable Node.js boilerplate with Express.js, featuring a well-structured architecture, built-in authentication, database integration, and comprehensive helper utilities.

## 🚀 Features

### Core Architecture
- **Modular Structure**: Clean separation of concerns with controllers, services, repositories, validators, and middlewares
- **Multi-threading**: Built-in cluster support for better performance
- **API Versioning**: Organized route structure with version control
- **Environment Configuration**: Easy environment variable management

### Authentication & Security
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: BCrypt integration for secure password storage
- **SHA256 Utilities**: Additional cryptographic helpers
- **Authorization Middleware**: Role-based access control

### Database Integration
- **Sequelize ORM**: Full database support with MySQL
- **Model Handler**: Centralized database connection management
- **Query Logging**: Built-in SQL query logging for debugging

### File Management
- **AWS S3 Integration**: Cloud file storage capabilities
- **File System Helper**: Local file operations utilities
- **File Type Detection**: Automatic file type recognition

### Communication
- **Email Service**: Nodemailer integration for email functionality
- **QR Code Generation**: Built-in QR code utilities

### AI Integration
- **Gemini AI Helper**: Google Gemini AI integration
- **AI-powered Features**: Ready-to-use AI capabilities

### Development Tools
- **Comprehensive Logging**: Structured logging system
- **Response Presets**: Standardized API response formats
- **Validation**: AJV schema validation
- **CORS Support**: Cross-origin resource sharing
- **Morgan Logging**: HTTP request logging

## 📁 Project Structure

```
EssadaJS/
├── src/
│   ├── controllers/          # Request handlers
│   │   └── primary/v1/
│   │       ├── Auth.controller.js
│   │       └── index.js
│   ├── helpers/             # Utility functions
│   │   ├── FileSystem.helper.js
│   │   ├── GeminiAI.helper.js
│   │   ├── JWT.helper.js
│   │   ├── Logger.helper.js
│   │   ├── Mailer.helper.js
│   │   ├── ResponsePreset.helper.js
│   │   ├── SHA256.helper.js
│   │   └── index.js
│   ├── middlewares/         # Request processing
│   │   ├── Handler.middleware.js
│   │   ├── primary/v1/
│   │   │   └── Authorization.middleware.js
│   │   └── index.js
│   ├── models/              # Database models
│   │   ├── Handler.model.js
│   │   ├── Users.model.example.js
│   │   └── index.js
│   ├── repositories/        # Data access layer
│   │   └── primary/v1/
│   │       ├── User.repository.js
│   │       └── index.js
│   ├── routes/              # API endpoints
│   │   ├── Handler.route.js
│   │   └── primary/v1/
│   │       ├── Auth.route.js
│   │       ├── Handler.route.js
│   │       └── index.js
│   ├── services/            # Business logic
│   │   └── primary/v1/
│   │       ├── Auth.service.js
│   │       └── index.js
│   ├── validators/          # Request validation
│   │   └── primary/v1/
│   │       ├── Auth.validator.js
│   │       └── index.js
│   └── Main.js             # Application entry point
├── storage/                 # File storage
│   ├── app/
│   └── configs/
├── package.json
└── README.md
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EssadaJS
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=3000
   IP=0.0.0.0
   SERVER_THREADS=4
   
   # Database Configuration
   DB_ENABLE=true
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   DB_DATABASE=your_database
   DB_DIALECT=mysql
   DB_LOGGING=true
   
   # JWT Configuration
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=24h
   
   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
  
   # Gemini AI Configuration (optional)
   GEMINI_API_KEY=your_gemini_api_key
   ```

## 🚀 Usage

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## 📚 Example API Response

**Response:**
```json
{
  "status": 200,
  "message": "OK",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "User Name"
    }
  }
}
```

### Response Format

All API responses follow a standardized format:

**Success Response:**
```json
{
  "status": 200,
  "message": "Success message",
  "data": { /* response data */ }
}
```

**Error Response:**
```json
{
  "status": 400,
  "message": "Error message",
  "err": {
    "type": "validation",
    "data": { /* error details */ }
  }
}
```

## 🔧 Configuration

### Database Models
Create your database models in `src/models/` following the Sequelize pattern:

```javascript
// Example: src/models/Users.model.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  
  return User;
};
```

### Adding New Routes
1. Create controller in `src/controllers/primary/v1/`
2. Create service in `src/services/primary/v1/`
3. Create validator in `src/validators/primary/v1/`
4. Create repository in `src/repositories/primary/v1/`
5. Add route in `src/routes/primary/v1/`

## 🛡️ Security Features

- **JWT Token Authentication**
- **Password Hashing with BCrypt**
- **CORS Protection**
- **Request Validation with AJV**
- **SQL Injection Protection (Sequelize)**
- **Environment Variable Security**

## 📦 Dependencies

### Core Dependencies
- **Express.js**: Web framework
- **Sequelize**: ORM for database operations
- **MySQL2**: MySQL database driver
- **JWT**: JSON Web Token authentication
- **BCrypt**: Password hashing

### Development Dependencies
- **Nodemon**: Development server with auto-reload
- **Morgan**: HTTP request logger

### Utility Dependencies
- **Axios**: HTTP client
- **Nodemailer**: Email functionality
- **QRCode**: QR code generation
- **AWS SDK**: Cloud storage integration
- **Moment**: Date/time utilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions, please open an issue in the repository.

---

**EssadaJS** - A modern Node.js boilerplate for building scalable applications.