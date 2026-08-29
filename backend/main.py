import os
from datetime import datetime
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient


# Load environment variables from .env
load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME")


# MongoDB connection
client = MongoClient(
    MONGODB_URL,
    serverSelectionTimeoutMS=5000,
    connectTimeoutMS=5000,
)

database = client[DATABASE_NAME]
robot_collection = database["robots"]
activity_collection = database["activities"]


# FastAPI application
app = FastAPI(
    title="RoboSphere API",
    description="Backend API for RoboSphere Virtual Robot System",
    version="1.0.0",
)


# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Virtual robot data
robot = {
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


# Request model for movement
class MovementRequest(BaseModel):
    direction: str


# Request model for settings
class SettingsRequest(BaseModel):
    name: str
    robot_id: str
    speed_limit: float
    obstacle_detection: bool
    notifications: bool


# Home endpoint
@app.get("/")
def home():
    return {
        "message": "RoboSphere Backend is running"
    }


# Get robot information
@app.get("/api/robot")
def get_robot():
    current_robot = robot_collection.find_one(
        {"robot_id": "RBS-001"},
        {"_id": 0}
    )

    if not current_robot:
        return {
            "message": "Robot not found"
        }

    return current_robot


# Move robot
@app.post("/api/robot/move")
def move_robot(request: MovementRequest):
    direction = request.direction.lower()

    current_robot = robot_collection.find_one(
        {"robot_id": "RBS-001"},
        {"_id": 0}
    )

    if not current_robot:
        return {"message": "Robot not found"}

    if current_robot["battery"] <= 0:
        robot_collection.update_one(
            {"robot_id": "RBS-001"},
            {
                "$set": {
                    "status": "Battery Empty",
                    "speed": 0.0
                }
            }
        )

        return {"message": "Robot cannot move"}

    x = current_robot["x"]
    y = current_robot["y"]

    if direction == "up":
        y = max(y - 10, 0)
        status = "Moving Forward"

    elif direction == "down":
        y = min(y + 10, 90)
        status = "Moving Backward"

    elif direction == "left":
        x = max(x - 10, 0)
        status = "Moving Left"

    elif direction == "right":
        x = min(x + 10, 90)
        status = "Moving Right"

    else:
        return {"message": "Invalid direction"}

    new_battery = max(
        current_robot["battery"] - 1,
        0
    )

    speed = current_robot.get(
        "speed_limit",
        1.2
    )

    robot_collection.update_one(
        {"robot_id": "RBS-001"},
        {
            "$set": {
                "x": x,
                "y": y,
                "battery": new_battery,
                "speed": speed,
                "status": status
            }
        }
    )

    updated_robot = robot_collection.find_one(
        {"robot_id": "RBS-001"},
        {"_id": 0}
    )

    return {
        "message": "Robot moved successfully",
        "robot": updated_robot
    }

# Stop robot
@app.post("/api/robot/stop")
def stop_robot():
    robot_collection.update_one(
        {"robot_id": "RBS-001"},
        {
            "$set": {
                "speed": 0.0,
                "status": "Stopped"
            }
        }
    )

    updated_robot = robot_collection.find_one(
        {"robot_id": "RBS-001"},
        {"_id": 0}
    )

    return {
        "message": "Robot stopped successfully",
        "robot": updated_robot
    }

# Update robot settings
@app.post("/api/robot/settings")
def update_settings(settings: SettingsRequest):

    robot_collection.update_one(
        {"robot_id": "RBS-001"},
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

    updated_robot = robot_collection.find_one(
        {"robot_id": settings.robot_id},
        {"_id": 0}
    )

    return {
        "message": "Settings saved successfully",
        "robot": updated_robot
    }


# Test MongoDB connection
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


# Save robot to MongoDB
@app.post("/api/database/robot/create")
def create_robot_in_database():
    try:
        client.admin.command("ping")

        existing_robot = robot_collection.find_one(
            {
                "robot_id": robot["robot_id"]
            }
        )

        if existing_robot:
            return {
                "message": "Robot already exists in MongoDB"
            }

        robot_collection.insert_one(
            robot.copy()
        )

        return {
            "message": "Robot saved to MongoDB successfully"
        }

    except Exception as error:
        return {
            "message": "MongoDB operation failed",
            "error": str(error),
        }

    from datetime import datetime


class ActivityRequest(BaseModel):
    action: str


@app.post("/api/activities")
def create_activity(activity: ActivityRequest):
    try:
        activity_data = {
            "robot_id": "RBS-001",
            "action": activity.action,
            "created_at": datetime.now(),
        }

        result = activity_collection.insert_one(activity_data)

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


@app.get("/api/activities")
def get_activities():
    try:
        activities = list(
            activity_collection.find(
                {},
                {"_id": 0}
            ).sort("created_at", -1)
        )

        return activities

    except Exception as error:
        return {
            "message": "Failed to get activities",
            "error": str(error),
        }


@app.delete("/api/activities")
def clear_activities():
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