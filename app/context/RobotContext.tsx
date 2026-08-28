
"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

type Activity = {
  id: number;
  action: string;
  time: string;
};

type RobotContextType = {
  x: number;
  y: number;
  battery: number;
  speed: number;
  status: string;
  distance: number;
  temperature: number;
  activities: Activity[];

  robotName: string;
  robotId: string;
  speedLimit: number;
  obstacleDetection: boolean;
  notifications: boolean;

  moveUp: () => void;
  moveDown: () => void;
  moveLeft: () => void;
  moveRight: () => void;
  stopRobot: () => void;
  clearActivities: () => void;
  refreshSensors: () => void;

  setRobotName: (value: string) => void;
  setRobotId: (value: string) => void;
  setSpeedLimit: (value: number) => void;
  setObstacleDetection: (value: boolean) => void;
  setNotifications: (value: boolean) => void;
  saveSettings: () => void;
};

const RobotContext =
  createContext<RobotContextType | undefined>(undefined);

export function RobotProvider({
  children,
}: {
  children: ReactNode;
}) {
  // Robot data
  const [x, setX] = useState(20);
  const [y, setY] = useState(50);
  const [battery, setBattery] = useState(100);
  const [speed, setSpeed] = useState(0);
  const [status, setStatus] = useState("Stopped");
  const [temperature, setTemperature] = useState(36);

  // Settings
  const [robotName, setRobotName] =
    useState("RoboSphere Robot");

  const [robotId, setRobotId] =
    useState("RBS-001");

  const [speedLimit, setSpeedLimit] =
    useState(1.2);

  const [obstacleDetection, setObstacleDetection] =
    useState(true);

  const [notifications, setNotifications] =
    useState(true);

  // Activity history
  const [activities, setActivities] =
    useState<Activity[]>([]);

  // Obstacle
  const obstacleX = 60;
  const obstacleY = 50;

  const distance = Math.round(
    Math.sqrt(
      Math.pow(x - obstacleX, 2) +
        Math.pow(y - obstacleY, 2)
    )
  );

  const addActivity = (action: string) => {
    const newActivity: Activity = {
      id: Date.now() + Math.random(),
      action,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setActivities((previous) => [
      newActivity,
      ...previous,
    ]);
  };

  const isObstacle = (
    newX: number,
    newY: number
  ) => {
    if (!obstacleDetection) {
      return false;
    }

    const distanceX = Math.abs(
      newX - obstacleX
    );

    const distanceY = Math.abs(
      newY - obstacleY
    );

    return (
      distanceX < 12 &&
      distanceY < 12
    );
  };

  const canMove = () => {
    if (battery <= 0) {
      setStatus("Battery Empty");
      setSpeed(0);

      addActivity(
        "Movement failed - battery empty"
      );

      return false;
    }

    return true;
  };

  const moveRobot = (
    newX: number,
    newY: number,
    movementStatus: string,
    activityMessage: string
  ) => {
    if (!canMove()) {
      return;
    }

    if (isObstacle(newX, newY)) {
      setStatus("Obstacle Detected");
      setSpeed(0);

      addActivity(
        "Obstacle detected - robot stopped"
      );

      return;
    }

    setX(newX);
    setY(newY);

    setBattery((previous) =>
      Math.max(previous - 1, 0)
    );

    setSpeed(speedLimit);
    setStatus(movementStatus);

    addActivity(activityMessage);
  };

  const moveUp = () => {
    moveRobot(
      x,
      Math.max(y - 10, 0),
      "Moving Forward",
      "Robot moved forward"
    );
  };

  const moveDown = () => {
    moveRobot(
      x,
      Math.min(y + 10, 90),
      "Moving Backward",
      "Robot moved backward"
    );
  };

  const moveLeft = () => {
    moveRobot(
      Math.max(x - 10, 0),
      y,
      "Moving Left",
      "Robot moved left"
    );
  };

  const moveRight = () => {
    moveRobot(
      Math.min(x + 10, 90),
      y,
      "Moving Right",
      "Robot moved right"
    );
  };

  const stopRobot = () => {
    setSpeed(0);
    setStatus("Stopped");

    addActivity("Robot stopped");
  };

  const clearActivities = () => {
    setActivities([]);
  };

  const refreshSensors = () => {
    const newTemperature =
      Math.floor(Math.random() * 10) + 30;

    setTemperature(newTemperature);

    addActivity(
      "Sensor data refreshed"
    );
  };

  const saveSettings = () => {
    addActivity(
      "Robot settings updated"
    );
  };

  return (
    <RobotContext.Provider
      value={{
        x,
        y,
        battery,
        speed,
        status,
        distance,
        temperature,
        activities,

        robotName,
        robotId,
        speedLimit,
        obstacleDetection,
        notifications,

        moveUp,
        moveDown,
        moveLeft,
        moveRight,
        stopRobot,
        clearActivities,
        refreshSensors,

        setRobotName,
        setRobotId,
        setSpeedLimit,
        setObstacleDetection,
        setNotifications,
        saveSettings,
      }}
    >
      {children}
    </RobotContext.Provider>
  );
}

export function useRobot() {
  const context = useContext(RobotContext);

  if (!context) {
    throw new Error(
      "useRobot must be used inside RobotProvider"
    );
  }

  return context;
}