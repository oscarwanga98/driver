let ws: WebSocket | null = null;

export const connectWebSocket = (driverId: string) => {
  if (!ws || ws.readyState === WebSocket.CLOSED) {
    // ws = new WebSocket("ws://192.168.0.11:8080");
    ws = new WebSocket(
      "ws://trinity1-location-matching-service-trial2.onrender.com"
    );

    ws.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      ws = null; // Reset WebSocket reference when closed
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }
};

export const sendLocationUpdate = (
  driverId: string,
  latitude: number,
  longitude: number
) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    const message = JSON.stringify({
      type: "driver-location-update",
      driverId,
      latitude,
      longitude,
    });

    ws.send(message);
    console.log("Location sent to WebSocket:", message);
  } else {
    console.error("WebSocket is not open");
  }
};
