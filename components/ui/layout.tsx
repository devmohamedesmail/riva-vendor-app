import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import AppUpdateChecker from "./app-update-checker";



export default function Layout({ children }: { children: React.ReactNode }) {

  return (

    <SafeAreaView edges={["right", "left"]} className={`flex-1 bg-white dark:bg-black `}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="black"

      />
      {children}
      <AppUpdateChecker />
    </SafeAreaView>

  );
}
