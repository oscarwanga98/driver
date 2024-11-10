import { useUser } from "@clerk/clerk-expo";
import { useAuth } from "@clerk/clerk-expo";
import axios from "axios";
import { io, Socket } from "socket.io-client";

// const SOCKET_SERVER_URL = "http://localhost:3000";
const SOCKET_SERVER_URL = "https://websocket-location-server.onrender.com";
const TOKEN_API_URL =
  "https://websocket-location-server.onrender.com/generate-jwt";
let socket: Socket | null = null;


// Function to request JWT token from the server
const fetchToken = async (userId: string): Promise<string> => {
  try {
    const response = await axios.post(TOKEN_API_URL, { userId });
    console.log(response.data)
    return response.data.token;
  } catch (error) {
    console.error("Error fetching token:", error);
    throw new Error("Failed to obtain JWT token");
  }
};

// Function to initialize the WebSocket connection
const initializeSocket = async (userId: string): Promise<void> => {
  try {
    const token = await fetchToken(userId);

    if (!socket) {
      socket = io(SOCKET_SERVER_URL, {
        extraHeaders: {
          authorization: token,
        },
        query: {
          clientType: "driver", // Add clientType as a query parameter
        },
      });

      socket.on("connect", () => {
        console.log("Connected to WebSocket server");
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from WebSocket server");
      });

      socket.on("connect_error", (error: Error) => {
        console.error("Connection error:", error);
      });
    }
  } catch (error) {
    console.error("Initialization failed:", error);
  }
};

// Function to get the initialized socket
const getSocket = (): Socket | null => {
  if (!socket) {
    console.warn(
      "Socket has not been initialized. Call initializeSocket first."
    );
  }
  return socket;
};

export { initializeSocket, getSocket };
