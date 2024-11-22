import create from "zustand";

import { PricingStore } from "@/types/type";

export const usePricingStore = create<PricingStore>((set) => ({
  baseFare: 150,
  distanceCost: 390,
  timeCost: 196,
  surgeMultiplier: "1.00",
  weatherAdjustment: 0,
  driverRatingAdjustment: "5%",
  prices: [
    {
      category: "Economy",
      maxPassengers: 3,
      engineCapacity: 650,
      price: "736.00",
    },
    {
      category: "Economy Plus",
      maxPassengers: 4,
      engineCapacity: 1000,
      price: "1104.00",
    },
    {
      category: "Motor Bike",
      maxPassengers: 1,
      engineCapacity: 150,
      price: "441.60",
    },
    {
      category: "Motor Bike Electric",
      maxPassengers: 1,
      engineCapacity: 100,
      price: "736.00",
    },
    {
      category: "XL",
      maxPassengers: 7,
      engineCapacity: 1500,
      price: "1472.00",
    },
  ],
  setBaseFare: (baseFare) => set({ baseFare }),
  setDistanceCost: (distanceCost) => set({ distanceCost }),
  setTimeCost: (timeCost) => set({ timeCost }),
  setSurgeMultiplier: (surgeMultiplier) => set({ surgeMultiplier }),
  setWeatherAdjustment: (weatherAdjustment) => set({ weatherAdjustment }),
  setDriverRatingAdjustment: (driverRatingAdjustment) =>
    set({ driverRatingAdjustment }),
  setPrices: (prices) => set({ prices }),
  setPricingData: (data) => set(data),
}));
