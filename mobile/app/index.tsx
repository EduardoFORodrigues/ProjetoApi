import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Toast from "react-native-toast-message"; // Importe o Toast aqui
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const validateEmail = (email: string) => {
  return email.includes("@") && email.includes(".");
};

const loginApi = async (credentials: { email: string; password: string }) => {

  const apiRoute = apiUrl + "/api/auth/login";
  const response = await axios.post(apiRoute, credentials);
  return response.data;
};

const LoginScreen = () => {
  const { login, userType } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate, isLoading } = useMutation(loginApi, {
    onSuccess: (data) => {
      Toast.show({
        type: "success",
        position: "bottom",
        text1: "Login realizado com sucesso!",
      });
      login(data.token);
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "Falha no login. Verifique suas credenciais.",
      });
    },
  });

  const handleLogin = () => {
    if (!email || !password) {
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "Por favor, preencha todos os campos.",
      });
      return;
    }

    if (!validateEmail(email)) {
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "Por favor, insira um email válido.",
      });
      return;
    }

    if (password.length < 6) {
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "A senha deve ter no mínimo 6 caracteres.",
      });
      return;
    }

    mutate({ email, password });
  };

  useEffect(() => {
    if (userType) {
      router.push(userType === "aluno" ? "/aluno/posts" : "/professor/posts");
    }
  }, [userType]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo!</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#BBDEFB"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#BBDEFB"
      />
      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Carregando..." : "Efetuar Login"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 30,
    color: "#0D47A1",
  },
  input: {
    width: "100%",
    height: 55,
    borderColor: "#BBDEFB",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
    fontSize: 16,
    color: "#0D47A1",
  },
  button: {
    width: "100%",
    paddingVertical: 15,
    backgroundColor: "#64B5F6",
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  buttonDisabled: {
    backgroundColor: "#BBDEFB",
  },
});

export default LoginScreen;
