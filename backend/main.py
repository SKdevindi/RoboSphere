import os
from datetime import datetime, timedelta

import dns.resolver
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from fastapi.middleware.cors import CORSMiddleware
from jose import jwt
from passlib.context import CryptContext
from pydantic import BaseModel
from pymongo import MongoClient


resolver = dns.resolver.Resolver(configure=False)
resolver.nameservers = ["8.8.8.8", "8.8.4.4"]
dns.resolver.default_resolver = resolver


load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME")

if not MONGODB_URL:
    raise ValueError("MONGODB_URL is missing from .env")

if not DATABASE_NAME:
    raise ValueError("DATABASE_NAME is missing from .env")


# --------------------------------------------------
# JWT Settings
# --------------------------------------------------

SECRET_KEY = "robosphere-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


# --------------------------------------------------
# MongoDB Connection
# --------------------------------------------------

client = MongoClient(
    MONGODB_URL,
    serverSelectionTimeoutMS=5000,
    connectTimeoutMS=5000,
)

database = client[DATABASE_NAME]

robot_collection = database["robots"]
activity_collection = database["activities"]
user_collection = database["users"]


# --------------------------------------------------
# Password Hashing
# --------------------------------------------------

password_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id = payload.get("user_id")
        email = payload.get("email")

        if not user_id or not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token"
            )

        return {
            "user_id": user_id,
            "email": email
        }

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token"
        )


# --------------------------------------------------
# FastAPI Application
# --------------------------------------------------

app = FastAPI(
    title="RoboSphere API",
    description="Backend API for RoboSphere Virtual Robot System",
    version="1.0.0",
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://robo-sphere-sigma.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# Default Robot Data
# --------------------------------------------------

default_robot = {
    "robot_id": "RBS-001",
    "name": "RoboSphere Robot",
    "status": "Stopped",
    "battery": 100,
    "speed": 0.0,
    "x": 20,
    "y": 50,
    "temperature": 36,
    "speed_limit": 1.2,
    "obstacle_detection": True,
    "notifications": True,
}


# --------------------------------------------------
# Request Models
# --------------------------------------------------

class MovementRequest(BaseModel):
    direction: str


class SettingsRequest(BaseModel):
    name: str
    robot_id: str
    speed_limit: float
    obstacle_detection: bool
    notifications: bool


class ActivityRequest(BaseModel):
    action: str


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


# --------------------------------------------------
# Helper Functions
# --------------------------------------------------

def get_current_robot():
    return robot_collection.find_one(
        {},
        {"_id": 0}
    )


def create_access_token(data: dict):
    token_data = data.copy()

    expire = datetime.utcnow() + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    token_data.update({
        "exp": expire
    })

    return jwt.encode(
        token_data,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


# --------------------------------------------------
# Home
# --------------------------------------------------

@app.get("/")
def home():
    return {
        "message": "RoboSphere Backend is running"
    }


# --------------------------------------------------
# MongoDB Test
# --------------------------------------------------

@app.get("/api/database/test")
def test_database():
    try:
        client.admin.command("ping")

        return {
            "message": "MongoDB connected successfully"
        }

    except Exception as error:
        return {
            "message": "MongoDB connection failed",
            "error": str(error),
        }


# --------------------------------------------------
# Register User
# --------------------------------------------------

@app.post("/api/auth/register")
def register_user(request: RegisterRequest):
    try:
        email = request.email.strip().lower()
        name = request.name.strip()

        if not name:
            return {
                "message": "Name is required"
            }

        if not email:
            return {
                "message": "Email is required"
            }

        if len(request.password) < 6:
            return {
                "message": "Password must be at least 6 characters"
            }

        existing_user = user_collection.find_one(
            {"email": email}
        )

        if existing_user:
            return {
                "message": "Email already registered"
            }

        hashed_password = password_context.hash(
            request.password
        )

        user_data = {
            "name": name,
            "email": email,
            "password": hashed_password,
            "created_at": datetime.now(),
        }

        result = user_collection.insert_one(
            user_data
        )

        return {
            "message": "User registered successfully",
            "user": {
                "id": str(result.inserted_id),
                "name": name,
                "email": email,
            },
        }

    except Exception as error:
        return {
            "message": "Registration failed",
            "error": str(error),
        }


# --------------------------------------------------
# Login User
# --------------------------------------------------

@app.post("/api/auth/login")
def login_user(request: LoginRequest):
    try:
        email = request.email.strip().lower()

        user = user_collection.find_one(
            {"email": email}
        )

        if not user:
            return {
                "message": "Invalid email or password"
            }

        password_valid = password_context.verify(
            request.password,
            user["password"]
        )

        if not password_valid:
            return {
                "message": "Invalid email or password"
            }

        access_token = create_access_token(
            {
                "user_id": str(user["_id"]),
                "email": user["email"],
            }
        )

        return {
            "message": "Login successful",
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": str(user["_id"]),
                "name": user["name"],
                "email": user["email"],
            },
        }

    except Exception as error:
        return {
            "message": "Login failed",
            "error": str(error),
        }


# --------------------------------------------------
# Create Initial Robot
# --------------------------------------------------

@app.post("/api/database/robot/create")
def create_robot_in_database():
    try:
        existing_robot = get_current_robot()

        if existing_robot:
            return {
                "message": "Robot already exists in MongoDB",
                "robot": existing_robot,
            }

        robot_collection.insert_one(
            default_robot.copy()
        )

        new_robot = get_current_robot()

        return {
            "message": "Robot saved to MongoDB successfully",
            "robot": new_robot,
        }

    except Exception as error:
        return {
            "message": "MongoDB operation failed",
            "error": str(error),
        }


# --------------------------------------------------
# Get Robot
# --------------------------------------------------

@app.get("/api/robot")
def get_robot():
    try:
        current_robot = get_current_robot()

        if not current_robot:
            return {
                "message": "Robot not found"
            }

        return current_robot

    except Exception as error:
        return {
            "message": "Failed to get robot",
            "error": str(error),
        }


# --------------------------------------------------
# Move Robot
# --------------------------------------------------

@app.post("/api/robot/move")
def move_robot(request: MovementRequest, current_user: dict = Depends(get_current_user)):
    try:
        current_robot = get_current_robot()

        if not current_robot:
            return {
                "message": "Robot not found"
            }

        if current_robot.get("battery", 0) <= 0:
            robot_collection.update_one(
                {},
                {
                    "$set": {
                        "status": "Battery Empty",
                        "speed": 0.0,
                    }
                }
            )

            updated_robot = get_current_robot()

            return {
                "message": "Robot cannot move because battery is empty",
                "robot": updated_robot,
            }

        direction = request.direction.lower()

        current_x = current_robot.get("x", 20)
        current_y = current_robot.get("y", 50)

        new_x = current_x
        new_y = current_y

        if direction == "up":
            new_y = max(current_y - 10, 0)
            status = "Moving Forward"

        elif direction == "down":
            new_y = min(current_y + 10, 90)
            status = "Moving Backward"

        elif direction == "left":
            new_x = max(current_x - 10, 0)
            status = "Moving Left"

        elif direction == "right":
            new_x = min(current_x + 10, 90)
            status = "Moving Right"

        else:
            return {
                "message": "Invalid direction"
            }

        obstacle_x = 60
        obstacle_y = 50

        obstacle_distance = round(
            (
                (new_x - obstacle_x) ** 2
                + (new_y - obstacle_y) ** 2
            ) ** 0.5
        )

        obstacle_detection_enabled = current_robot.get(
            "obstacle_detection",
            True
        )

        if (
            obstacle_detection_enabled
            and obstacle_distance <= 10
        ):
            robot_collection.update_one(
                {},
                {
                    "$set": {
                        "speed": 0.0,
                        "status": "Obstacle Detected",
                    }
                }
            )

            updated_robot = get_current_robot()

            return {
                "message": "Obstacle detected. Movement stopped.",
                "obstacle_detected": True,
                "distance": obstacle_distance,
                "robot": updated_robot,
            }

        new_battery = max(
            current_robot.get("battery", 100) - 1,
            0
        )

        speed = current_robot.get(
            "speed_limit",
            1.2
        )

        robot_collection.update_one(
            {},
            {
                "$set": {
                    "x": new_x,
                    "y": new_y,
                    "battery": new_battery,
                    "speed": speed,
                    "status": status,
                }
            }
        )

        updated_robot = get_current_robot()

        return {
            "message": "Robot moved successfully",
            "obstacle_detected": False,
            "distance": obstacle_distance,
            "robot": updated_robot,
        }

    except Exception as error:
        return {
            "message": "Robot movement failed",
            "error": str(error),
        }


# --------------------------------------------------
# Stop Robot
# --------------------------------------------------

@app.post("/api/robot/stop")
def stop_robot(current_user: dict = Depends(get_current_user)):
    try:
        current_robot = get_current_robot()

        if not current_robot:
            return {
                "message": "Robot not found"
            }

        robot_collection.update_one(
            {},
            {
                "$set": {
                    "speed": 0.0,
                    "status": "Stopped",
                }
            }
        )

        updated_robot = get_current_robot()

        return {
            "message": "Robot stopped successfully",
            "robot": updated_robot,
        }

    except Exception as error:
        return {
            "message": "Failed to stop robot",
            "error": str(error),
        }


# --------------------------------------------------
# Update Settings
# --------------------------------------------------

@app.post("/api/robot/settings")
def update_settings(settings: SettingsRequest, current_user: dict = Depends(get_current_user)):
    try:
        current_robot = get_current_robot()

        if not current_robot:
            return {
                "message": "Robot not found"
            }

        robot_collection.update_one(
            {},
            {
                "$set": {
                    "name": settings.name,
                    "robot_id": settings.robot_id,
                    "speed_limit": settings.speed_limit,
                    "obstacle_detection": settings.obstacle_detection,
                    "notifications": settings.notifications,
                }
            }
        )

        updated_robot = get_current_robot()

        return {
            "message": "Settings saved successfully",
            "robot": updated_robot,
        }

    except Exception as error:
        return {
            "message": "Failed to save settings",
            "error": str(error),
        }


# --------------------------------------------------
# Sensor Data
# --------------------------------------------------

@app.get("/api/robot/sensors")
def get_robot_sensors(current_user: dict = Depends(get_current_user)):
    try:
        current_robot = get_current_robot()

        if not current_robot:
            return {
                "message": "Robot not found"
            }

        obstacle_x = 60
        obstacle_y = 50

        x = current_robot.get("x", 20)
        y = current_robot.get("y", 50)

        distance = round(
            (
                (x - obstacle_x) ** 2
                + (y - obstacle_y) ** 2
            ) ** 0.5
        )

        obstacle_detected = distance <= 10

        return {
            "battery": current_robot.get(
                "battery",
                100
            ),
            "temperature": current_robot.get(
                "temperature",
                36
            ),
            "speed": current_robot.get(
                "speed",
                0.0
            ),
            "distance": distance,
            "obstacle_detected": obstacle_detected,
            "obstacle_detection_enabled": current_robot.get(
                "obstacle_detection",
                True
            ),
            "status": current_robot.get(
                "status",
                "Stopped"
            ),
            "x": x,
            "y": y,
        }

    except Exception as error:
        return {
            "message": "Failed to get sensor data",
            "error": str(error),
        }


# --------------------------------------------------
# Create Activity
# --------------------------------------------------

@app.post("/api/activities")
def create_activity(activity: ActivityRequest, current_user: dict = Depends(get_current_user)):
    try:
        current_robot = get_current_robot()

        robot_id = "RBS-001"

        if current_robot:
            robot_id = current_robot.get(
                "robot_id",
                "RBS-001"
            )

        activity_data = {
            "robot_id": robot_id,
            "action": activity.action,
            "created_at": datetime.now(),
        }

        result = activity_collection.insert_one(
            activity_data
        )

        return {
            "message": "Activity saved successfully",
            "activity": {
                "id": str(result.inserted_id),
                "robot_id": activity_data["robot_id"],
                "action": activity_data["action"],
                "created_at": activity_data["created_at"],
            },
        }

    except Exception as error:
        return {
            "message": "Failed to save activity",
            "error": str(error),
        }


# --------------------------------------------------
# Get Activity History
# --------------------------------------------------

@app.get("/api/activities")
def get_activities(current_user: dict = Depends(get_current_user)):
    try:
        activities = list(
            activity_collection
            .find(
                {},
                {"_id": 0}
            )
            .sort(
                "created_at",
                -1
            )
        )

        return activities

    except Exception as error:
        return {
            "message": "Failed to get activities",
            "error": str(error),
        }


# --------------------------------------------------
# Clear Activity History
# --------------------------------------------------

@app.delete("/api/activities")
def clear_activities(current_user: dict = Depends(get_current_user)):
    try:
        activity_collection.delete_many({})

        return {
            "message": "Activity history cleared successfully"
        }

    except Exception as error:
        return {
            "message": "Failed to clear activities",
            "error": str(error),
        }