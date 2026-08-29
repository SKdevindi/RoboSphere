"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type Activity = {
  id: string;
  action: string;
  time: string;
};

type RobotContextType = {
  x: number;
  y: number;
  battery: number;
  speed: number;
  status: string;
  temperature: number;
  distance: number;
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

  refreshRobot: () => void;
  refreshSensors: () => void;
  refreshActivities: () => void;
  clearActivities: () => void;

  setRobotName: (value: string) => void;
  setRobotId: (value: string) => void;
  setSpeedLimit: (value: number) => void;
  setObstacleDetection: (value: boolean) => void;
  setNotifications: (value: boolean) => void;

  saveSettings: () => Promise<boolean>;
};

const RobotContext =
  createContext<RobotContextType | undefined>(undefined);

const API_URL = "http://127.0.0.1:8000";

export function RobotProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [x, setX] = useState(20);
  const [y, setY] = useState(50);
  const [battery, setBattery] = useState(100);
  const [speed, setSpeed] = useState(0);
  const [status, setStatus] = useState("Stopped");
  const [temperature, setTemperature] = useState(36);

  const [robotName, setRobotName] =
    useState("RoboSphere Robot");

  const [robotId, setRobotId] =
    useState("RBS-001");

  const [speedLimit, setSpeedLimit] =
    useState(1.2);

  const [
    obstacleDetection,
    setObstacleDetection,
  ] = useState(true);

  const [
    notifications,
    setNotifications,
  ] = useState(true);

  const [activities, setActivities] =
    useState<Activity[]>([]);

  const obstacleX = 60;
  const obstacleY = 50;

  const distance = Math.round(
    Math.sqrt(
      Math.pow(x - obstacleX, 2) +
        Math.pow(y - obstacleY, 2)
    )
  );

  const updateRobotState = (robot: any) => {
    if (!robot) {
      return;
    }

    setX(robot.x ?? 20);
    setY(robot.y ?? 50);
    setBattery(robot.battery ?? 100);
    setSpeed(robot.speed ?? 0);
    setStatus(robot.status ?? "Stopped");
    setTemperature(robot.temperature ?? 36);

    setRobotName(
      robot.name ?? "RoboSphere Robot"
    );

    setRobotId(
      robot.robot_id ?? "RBS-001"
    );

    setSpeedLimit(
      robot.speed_limit ?? 1.2
    );

    setObstacleDetection(
      robot.obstacle_detection ?? true
    );

    setNotifications(
      robot.notifications ?? true
    );
  };

  const refreshRobot = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/robot`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to get robot data"
        );
      }

      const data = await response.json();

      updateRobotState(data);
    } catch (error) {
      console.error(
        "Robot data error:",
        error
      );
    }
  };

  const saveActivity = async (
    action: string
  ) => {
    try {
      const response = await fetch(
        `${API_URL}/api/activities`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            action,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(
          "Activity save failed:",
          data
        );
        return;
      }

      await refreshActivities();
    } catch (error) {
      console.error(
        "Activity error:",
        error
      );
    }
  };

  const refreshActivities = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/activities`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to get activities"
        );
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        console.error(
          "Invalid activity data:",
          data
        );
        return;
      }

      const formattedActivities: Activity[] =
        data.map(
          (
            activity: {
              action: string;
              created_at?: string;
            },
            index: number
          ) => {
            const activityDate =
              activity.created_at
                ? new Date(
                    activity.created_at
                  )
                : new Date();

            return {
              id: `${activity.created_at ?? "activity"}-${index}`,
              action:
                activity.action ??
                "Unknown activity",
              time:
                activityDate.toLocaleTimeString(
                  [],
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                ),
            };
          }
        );

      setActivities(
        formattedActivities
      );
    } catch (error) {
      console.error(
        "Activity history error:",
        error
      );
    }
  };

  useEffect(() => {
    refreshRobot();
    refreshActivities();
  }, []);

  const moveRobot = async (
    direction: string,
    activityMessage: string
  ) => {
    try {
      const response = await fetch(
        `${API_URL}/api/robot/move`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            direction,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(
          "Move failed:",
          data
        );
        return;
      }

      if (data.robot) {
        updateRobotState(
          data.robot
        );

        await saveActivity(
          activityMessage
        );
      }
    } catch (error) {
      console.error(
        "Robot movement error:",
        error
      );
    }
  };

  const moveUp = () => {
    moveRobot(
      "up",
      "Robot moved forward"
    );
  };

  const moveDown = () => {
    moveRobot(
      "down",
      "Robot moved backward"
    );
  };

  const moveLeft = () => {
    moveRobot(
      "left",
      "Robot moved left"
    );
  };

  const moveRight = () => {
    moveRobot(
      "right",
      "Robot moved right"
    );
  };

  const stopRobot = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/robot/stop`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(
          "Stop failed:",
          data
        );
        return;
      }

      if (data.robot) {
        updateRobotState(
          data.robot
        );

        await saveActivity(
          "Robot stopped"
        );
      }
    } catch (error) {
      console.error(
        "Robot stop error:",
        error
      );
    }
  };

  const refreshSensors = async () => {
    await refreshRobot();

    await saveActivity(
      "Sensor data refreshed"
    );
  };

  const clearActivities = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/activities`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(
          "Failed to clear activities:",
          data
        );
        return;
      }

      setActivities([]);
    } catch (error) {
      console.error(
        "Clear activity error:",
        error
      );
    }
  };

  const saveSettings =
    async (): Promise<boolean> => {
      try {
        const response = await fetch(
          `${API_URL}/api/robot/settings`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              name: robotName,
              robot_id: robotId,
              speed_limit:
                speedLimit,
              obstacle_detection:
                obstacleDetection,
              notifications,
            }),
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          console.error(
            "Settings save failed:",
            data
          );

          return false;
        }

        if (data.robot) {
          updateRobotState(
            data.robot
          );
        }

        await saveActivity(
          "Robot settings updated"
        );

        return true;
      } catch (error) {
        console.error(
          "Settings error:",
          error
        );

        return false;
      }
    };

  return (
    <RobotContext.Provider
      value={{
        x,
        y,
        battery,
        speed,
        status,
        temperature,
        distance,
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

        refreshRobot,
        refreshSensors,
        refreshActivities,
        clearActivities,

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
  const context =
    useContext(RobotContext);

  if (!context) {
    throw new Error(
      "useRobot must be used inside RobotProvider"
    );
  }

  return context;
}
