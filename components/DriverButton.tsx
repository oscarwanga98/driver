import { Text, Image, View, TouchableOpacity } from "react-native";

import { icons } from "@/constants";

import { DriverButtonProps } from "@/types/type";

const DriverButton = ({ statusDriver, toggle }: DriverButtonProps) => {
  return (
    <TouchableOpacity
      onPress={toggle}
      className="flex flex-row justify-between p-2"
    >
      <Text className="text-3xl font-JakartaBold mt-3">
        Your are {statusDriver ? "Online" : "Offline"}{" "}
      </Text>
      <View
        className={
          statusDriver
            ? "bg-slate-500 p-3 rounded-full"
            : "bg-rose-700 p-3 rounded-full"
        }
      >
        <View
          className={`flex flex-row justify-center items-center rounded-full ${statusDriver ? "bg-slate-600" : ""}`}
        >
          <View
            className={`rounded-full w-12 h-12 items-center justify-center ${statusDriver ? "bg-general-400" : ""}`}
          >
            <Image
              source={icons.powerButton}
              tintColor="white"
              resizeMode="contain"
              className="w-7 h-7"
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default DriverButton;
