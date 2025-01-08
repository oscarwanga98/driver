import { useAuth } from "@clerk/clerk-expo";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";

import { useDriverLocationStore, useDriverSateStore } from "@/store";

// Import WebSocket helper functions
import {
  initializeSocket,
  getSocket,
  sendMessage,
} from "../services/socketService";

const LocationUpdater = () => {
  const { setLocation } = useDriverLocationStore();
  const { isOnline } = useDriverSateStore();
  const { userId } = useAuth();
  const driverId = userId ?? "defaultDriverId";

  const [isConnected, setIsConnected] = useState(false);

  const fetchAndUpdateLocation = async () => {
    try {
      const locationCurrent = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        latitude: locationCurrent.coords.latitude,
        longitude: locationCurrent.coords.longitude,
      });

      const latitude = locationCurrent.coords.latitude;
      const longitude = locationCurrent.coords.longitude;
      // Update local state
      setLocation({
        latitude,
        longitude,
        address: `${address[0]?.name ?? ""}, ${address[0]?.region ?? ""}`,
      });

      // Send location update to the server via WebSocket
      sendMessage("driver-location-update", {
        driverId,
        latitude,
        longitude,
      });
    } catch (error) {
      console.error("Error fetching or sending location:", error);
    }
  };

  useEffect(() => {
    if (!isOnline) return;

    const startWebSocket = async () => {
      try {
        await initializeSocket(driverId);
        setIsConnected(true);
        console.log("WebSocket successfully initialized.");
      } catch (error) {
        console.error("Failed to initialize WebSocket:", error);
      }
    };

    startWebSocket();

    // Fetch and send location periodically
    const interval = setInterval(() => {
      if (isConnected) fetchAndUpdateLocation();
    }, 20000);

    // Initial location fetch
    if (isConnected) fetchAndUpdateLocation();

    return () => {
      const socket = getSocket();
      if (socket) socket.disconnect();
      clearInterval(interval);
    };
  }, [isOnline, driverId, isConnected]);

  return null;
};

export default LocationUpdater;
