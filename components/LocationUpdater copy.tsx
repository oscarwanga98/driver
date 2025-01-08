import { useAuth } from "@clerk/clerk-expo";
import * as Location from "expo-location";
import { useEffect } from "react";

import { useDriverLocationStore, useDriverSateStore } from "@/store";

// Import the WebSocket helper functions
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

  useEffect(() => {
    let isMounted = isOnline;
    const socket = getSocket();
    // Connect WebSocket when component mounts
    initializeSocket(driverId);
    
    const updateLocation = async () => {
      try {
        const locationCurrent = await Location.getCurrentPositionAsync({});
        const address = await Location.reverseGeocodeAsync({
          latitude: locationCurrent.coords?.latitude!,
          longitude: locationCurrent.coords?.longitude!,
        });

        if (isMounted) {
          const latitude = locationCurrent.coords?.latitude!;
          const longitude = locationCurrent.coords?.longitude!;

          // Update local state
          setLocation({
            latitude,
            longitude,
            address: `${address[0].name}, ${address[0].region}`,
          });

          // Send location to the WebSocket server
          if (socket) {
            socket.emit("driver-location-update", {
              driverId,
              latitude,
              longitude,
            });
          }
        }
      } catch (error) {
        console.error("Error getting location:", error);
      }
    };

    // Update location every 20 seconds
    const interval = setInterval(updateLocation, 5000);

    // Initial location fetch
    updateLocation();

    return () => {
      isMounted = false;
      clearInterval(interval); // Cleanup interval on unmount
    };
  }, [setLocation, isOnline, driverId]);

  return null;
};

export default LocationUpdater;
