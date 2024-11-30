import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Card } from "react-native-paper";
import theme from "../../../theme";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";

const TeacherHome = () => {
  const { logout } = useAuth();
  const redirect = (route: any) => {
    router.push(route);
  };
  const handleLogout = () => {
    router.push("/");
    logout();
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Sair</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Bem-vindo, Professor!</Text>
          <Text style={styles.noticeText}>
            Bem-vindo ao Painel do Professor! Aqui você pode gerenciar seus
            posts, professores e estudantes.
          </Text>
        </Card.Content>
      </Card>
      {/* Card de Ações Principais */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Ações Rápidas</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => redirect("professor/posts")}
            >
              <Text style={styles.actionText}>Gerenciar Posts</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => redirect("professor/teachers")}
            >
              <Text style={styles.actionText}>Gerenciar Professores</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => redirect("professor/students")}
            >
              <Text style={styles.actionText}>Gerenciar Estudantes</Text>
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  actionsContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginTop: 16,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.primary,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginBottom: 8,
  },
  actionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  noticeText: {
    fontSize: 16,
    color: "#555",
  },
  buttonContainer: {
    marginTop: 32,
  },
  button: {
    marginBottom: 16,
  },
  logoutButton: {
    alignSelf: "flex-end",
    backgroundColor: "#e53e3e",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },

  logoutButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default TeacherHome;
