import { useAuth } from "@clerk/clerk-expo";
import * as Location from "expo-location";
import { useEffect } from "react";

import { connectWebSocket, sendLocationUpdate } from "@/app/(api)/ws"; // Import the WebSocket helper functions
import { useDriverLocationStore, useDriverSateStore } from "@/store";

const LocationUpdater = () => {
  const { setLocation } = useDriverLocationStore();
  const { isOnline } = useDriverSateStore();
  const { userId } = useAuth();
  const driverId = userId ?? "defaultDriverId";

  useEffect(() => {
    let isMounted = isOnline;

    // Connect WebSocket when component mounts
    connectWebSocket(driverId);

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
          sendLocationUpdate(driverId, latitude, longitude);
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
  }, [setLocation, isOnline]);

  return null;
};

export default LocationUpdater;
