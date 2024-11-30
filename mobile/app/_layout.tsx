import { Slot } from "expo-router";
import { AuthProvider } from "@/context/AuthContext";
import { PaperProvider } from "react-native-paper";
import theme from "@/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function _layout() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider
        theme={{
          ...theme,
        }}
      >
        <AuthProvider>
          <Slot />
        </AuthProvider>
      </PaperProvider>
    </QueryClientProvider>
  );
}
