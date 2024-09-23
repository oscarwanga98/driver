const WebSocket = require("ws");
let ws; // WebSocket reference outside the function to maintain state

export async function POST(request: Request) {
  try {
    const { driverId, latitude, longitude } = await request.json();

    if (!driverId || !latitude || !longitude) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Establish WebSocket connection if not already connected
    if (!ws || ws.readyState === WebSocket.CLOSED) {
      ws = new WebSocket("ws://localhost:8080");

      ws.onopen = () => {
        console.log("WebSocket connection established");
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed");
        ws = null; // Reset ws reference when closed
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    }

    // Prepare the location message
    const message = JSON.stringify({
      type: "driver-location-update",
      driverId,
      latitude,
      longitude,
    });

    // Ensure WebSocket is open before sending
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(message);
      console.log("Location sent to WebSocket:", message);
    } else {
      return Response.json({ error: "WebSocket is not open" }, { status: 500 });
    }

    return new Response(
      JSON.stringify({ message: "Location updated successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in WebSocket communication:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
