import React, { useEffect, useMemo } from "react";
import { router, Tabs } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import theme from "@/theme";

const TabLayout = () => {
  const { userType } = useAuth();

  const renderScreen = (name: string, title: string, showHeader: boolean) => (
    <Tabs.Screen
      key={name}
      name={name}
      options={{
        title,
        headerShown: showHeader,
        tabBarIconStyle: { display: "none" },
      }}
    />
  );

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.buttonText,
        tabBarStyle: {
          backgroundColor: theme.colors.primary,
        },
        tabBarActiveTintColor: theme.colors.buttonText,
        tabBarInactiveTintColor: "#888",
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: "600",
        },
      }}
    >
      {renderScreen("index", "Home", userType === "aluno")}
      {renderScreen("posts", "Posts", userType === "professor")}
      {renderScreen("teachers", "Professores", userType === "aluno")}
      {renderScreen("students", "Estudantes", userType === "aluno")}
    </Tabs>
  );
};

export default TabLayout;
