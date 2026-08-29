# 🤖 RoboSphere

**RoboSphere** is a web-based virtual robot control and monitoring system that allows users to control a simulated robot, monitor sensor information, manage robot settings, and view activity history through a modern web interface.

## 🚀 Features

- User Registration and Login
- JWT Authentication
- Virtual Robot Control
- Move Forward, Backward, Left, and Right
- Emergency Stop
- Obstacle Detection
- Real-time Sensor Monitoring
- Battery Monitoring
- Temperature Monitoring
- Speed Monitoring
- Robot Position Tracking
- Activity History
- Robot Settings Management
- MongoDB Database Integration
- Responsive Dashboard

## 🛠️ Technologies Used

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- Python
- FastAPI
- JWT Authentication
- REST API

### Database

- MongoDB Atlas

### Development Tools

- Visual Studio Code
- Git
- GitHub
- Swagger UI
- Postman

## 📁 Project Structure

```text
RoboSphere/
│
├── backend/
│   ├── main.py
│   ├── .env
│   └── venv/
│
├── frontend/
│   ├── app/
│   │   ├── activity-history/
│   │   ├── components/
│   │   ├── context/
│   │   ├── login/
│   │   ├── register/
│   │   ├── robot-control/
│   │   ├── sensors/
│   │   ├── settings/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   └── package.json
│
├── .gitignore
└── README.md
```

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/SKdevindi/RoboSphere.git
cd RoboSphere
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open the application at:

```text
http://localhost:3000
```

### 3. Backend Setup

Open another terminal:

```bash
cd backend
py -m venv venv
```

Activate the virtual environment on Windows:

```bash
.\venv\Scripts\activate
```

Install the required packages:

```bash
pip install fastapi uvicorn pymongo dnspython python-dotenv passlib bcrypt==4.0.1 python-jose
```

Start the backend:

```bash
python -m uvicorn main:app --reload
```

Backend runs at:

```text
http://127.0.0.1:8000
```

Swagger API documentation:

```text
http://127.0.0.1:8000/docs
```

## 🗄️ MongoDB Setup

Create a MongoDB Atlas database and configure the backend `.env` file.

Example:

```env
MONGODB_URL=your_mongodb_connection_string
DATABASE_NAME=robosphere
```

> Never commit the `.env` file or database credentials to GitHub.

The application uses collections such as:

```text
robots
activities
users
```

## 🔐 Authentication

RoboSphere includes user authentication using:

- User Registration
- User Login
- Password Hashing
- JWT Access Tokens
- Protected Application Pages
- Logout

## 🎮 Robot Control

Users can control the virtual robot using the Robot Control interface.

Supported actions include:

```text
Forward
Backward
Left
Right
Stop
```

The system also includes obstacle detection to prevent unsafe virtual robot movement.

## 📡 Sensor Monitoring

The Sensors page displays robot information such as:

- Distance
- Temperature
- Battery Level
- Speed
- X Position
- Y Position
- Robot Status
- Obstacle Protection Status

## 📜 Activity History

Robot actions are stored in MongoDB and displayed on the Activity History page.

Examples include:

```text
Robot moved forward
Robot moved backward
Robot moved left
Robot moved right
Robot stopped
Settings updated
```

## ⚙️ Robot Settings

Users can configure:

- Robot Name
- Robot ID
- Maximum Speed
- Obstacle Detection
- Notifications

## 🔌 Main API Endpoints

```text
POST   /api/auth/register
POST   /api/auth/login

GET    /api/robot
POST   /api/robot/move
POST   /api/robot/stop
POST   /api/robot/settings
GET    /api/robot/sensors

GET    /api/activities
POST   /api/activities
DELETE /api/activities
```

## 🧪 API Testing

FastAPI provides Swagger UI for testing the backend API.

Start the backend and visit:

```text
http://127.0.0.1:8000/docs
```

Postman can also be used for API testing.

## 🔮 Future Improvements

Possible future improvements include:

- Multiple robot support
- Advanced robot simulation
- Live sensor charts
- Robot path visualization
- Admin dashboard
- User roles and permissions
- Cloud deployment
- Real-time communication using WebSockets

## 👩‍💻 Author

Developed as a full-stack web development project.

## 📄 License

This project is intended for educational purposes.