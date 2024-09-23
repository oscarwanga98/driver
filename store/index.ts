import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  DriverStore,
  LocationStore,
  MarkerData,
  DriverState,
  DriverLocationStore
} from "@/types/type";

export const useLocationStore = create<LocationStore>((set) => ({
  userLatitude: null,
  userLongitude: null,
  userAddress: null,
  destinationLatitude: null,
  destinationLongitude: null,
  destinationAddress: null,
  setUserLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    set(() => ({
      userLatitude: latitude,
      userLongitude: longitude,
      userAddress: address,
    }));

    // if driver is selected and now new location is set, clear the selected driver
    const { selectedDriver, clearSelectedDriver } = useDriverStore.getState();
    if (selectedDriver) clearSelectedDriver();
  },

  setDestinationLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    set(() => ({
      destinationLatitude: latitude,
      destinationLongitude: longitude,
      destinationAddress: address,
    }));

    // if driver is selected and now new location is set, clear the selected driver
    const { selectedDriver, clearSelectedDriver } = useDriverStore.getState();
    if (selectedDriver) clearSelectedDriver();
  },
}));

export const useDriverStore = create<DriverStore>((set) => ({
  drivers: [] as MarkerData[],
  selectedDriver: null,
  setSelectedDriver: (driverId: number) =>
    set(() => ({ selectedDriver: driverId })),
  setDrivers: (drivers: MarkerData[]) => set(() => ({ drivers })),
  clearSelectedDriver: () => set(() => ({ selectedDriver: null })),
}));

export const useDriverSateStore = create<DriverState>()(
  persist(
    (set) => ({
      isOnline: false, // Default is offline when the app starts

      // Method to set the driver to online mode
      setOnline: () => set({ isOnline: true }),

      // Method to set the driver to offline mode
      setOffline: () => set({ isOnline: false }),

      // Toggle between online and offline
      toggleOnlineStatus: () => set((state) => ({ isOnline: !state.isOnline })),
    }),
    {
      name: "driver-status", // name of the item in local storage
      getStorage: () => AsyncStorage, // can use AsyncStorage or local storage for web
    }
  )
);
export const useDriverLocationStore = create<DriverLocationStore>((set) => ({
  location: {
    address: "",
    latitude: 0,
    longitude: 0,
  },
  setLocation: (newLocation) =>
    set({
      location: newLocation,
    }),
}));
